import { Usuario } from '../types/usuario';
import api from './api';

const CHAVE_TOKEN = 'accessToken';
const CHAVE_USUARIO = 'mini-kanban-user';

interface UsuarioApi {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface RespostaLoginApi {
  accessToken: string;
  user: UsuarioApi;
}

function converterUsuario(usuario: UsuarioApi): Usuario {
  return {
    id: usuario.id,
    nome: usuario.name,
    email: usuario.email,
    urlAvatar: usuario.avatarUrl,
  };
}

function salvarUsuario(usuario: Usuario) {
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}

export const servicoAutenticacao = {
  async entrar(credenciais: { email: string; senha: string }): Promise<Usuario> {
    const resposta = await api.post<RespostaLoginApi>('/auth/login', {
      email: credenciais.email,
      password: credenciais.senha,
    });

    const { accessToken, user } = resposta.data;

    if (!accessToken || !user?.email) {
      throw new Error('Resposta de login inválida do servidor.');
    }

    const usuario = converterUsuario(user);
    localStorage.setItem(CHAVE_TOKEN, accessToken);
    salvarUsuario(usuario);
    return usuario;
  },

  sair() {
    limparSessao();
  },

  obterUsuario(): Usuario | null {
    const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);

    if (!usuarioSalvo) {
      return null;
    }

    try {
      return JSON.parse(usuarioSalvo) as Usuario;
    } catch (erro) {
      console.error('Não foi possível recuperar o usuário salvo.', erro);
      limparSessao();
      return null;
    }
  },

  async atualizarPerfil(dados: { nome: string }): Promise<Usuario> {
    const resposta = await api.patch<UsuarioApi>('/users/me', { name: dados.nome });
    const usuario = converterUsuario(resposta.data);
    salvarUsuario(usuario);
    return usuario;
  },

  async cadastrar(nome: string, email: string, senha: string): Promise<void> {
    await api.post('/auth/register', { name: nome, email, password: senha });
  },

  async solicitarRedefinicaoSenha(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async redefinirSenha(token: string, senha: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password: senha });
  },
};

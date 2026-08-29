import { Usuario } from '../types/usuario';
import api from './api';

const CHAVE_USUARIO = 'mini-kanban-user';

interface UsuarioApi {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

function converterUsuario(usuario: UsuarioApi): Usuario {
  return {
    id: usuario.id,
    nome: usuario.name,
    email: usuario.email,
    urlAvatar: usuario.avatarUrl,
  };
}

function converterUsuarioParaApi(dados: { nome?: string; urlAvatar?: string }) {
  return {
    name: dados.nome,
    avatarUrl: dados.urlAvatar,
  };
}

function salvarUsuario(usuario: Usuario) {
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

export const servicoAutenticacao = {
  async entrar(credenciais: { email: string; senha: string }): Promise<Usuario> {
    const resposta = await api.post('/auth/login', { email: credenciais.email, password: credenciais.senha });
    const { accessToken, user } = resposta.data as { accessToken?: string; user?: UsuarioApi };

    if (!accessToken || !user?.email) {
      throw new Error('Resposta de login inválida do servidor.');
    }

    const usuario = converterUsuario(user);
    localStorage.setItem('accessToken', accessToken);
    salvarUsuario(usuario);
    return usuario;
  },

  sair() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem(CHAVE_USUARIO);
  },

  obterUsuario(): Usuario | null {
    const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);

    if (!usuarioSalvo || usuarioSalvo === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(usuarioSalvo) as Usuario;
    } catch (erro) {
      console.error('Não foi possível recuperar o usuário salvo.', erro);
      this.sair();
      return null;
    }
  },

  async atualizarPerfil(dados: { nome?: string; urlAvatar?: string }): Promise<Usuario> {
    const resposta = await api.patch<UsuarioApi>('/users/me', converterUsuarioParaApi(dados));
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

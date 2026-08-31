import { MessageSquare, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import { servicoComentarios } from '../services/servicoComentarios';
import { Comentario } from '../types/quadro';

interface PainelComentariosProps {
  tarefaId: string;
  aoAlterarQuantidade?: (tarefaId: string, quantidade: number) => void;
}

function formatarDataComentario(dataTexto: string): string {
  const data = new Date(dataTexto);
  const agora = new Date();
  const diferencaMs = agora.getTime() - data.getTime();
  const diferencaMinutos = Math.floor(diferencaMs / 60000);

  if (diferencaMinutos < 1) return 'agora mesmo';
  if (diferencaMinutos < 60) return `${diferencaMinutos}m atrás`;

  const diferencaHoras = Math.floor(diferencaMinutos / 60);
  if (diferencaHoras < 24) return `${diferencaHoras}h atrás`;

  const diferencaDias = Math.floor(diferencaHoras / 24);
  if (diferencaDias < 7) return `${diferencaDias}d atrás`;

  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function obterIniciais(nome: string): string {
  return nome
    .split(' ')
    .map((palavra) => palavra[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function obterCorAvatar(iniciais: string): string {
  const cores = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#fb923c'];
  return cores[iniciais.charCodeAt(0) % cores.length];
}

export function PainelComentarios({ tarefaId, aoAlterarQuantidade }: PainelComentariosProps) {
  const { usuario } = useAutenticacao();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [entradaComentario, setEntradaComentario] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);

      try {
        const comentariosDaTarefa = await servicoComentarios.listar(tarefaId);
        setComentarios(comentariosDaTarefa);
      } catch (erro) {
        console.error('Erro ao carregar comentários:', erro);
      } finally {
        setCarregando(false);
      }
    };

    void carregar();
  }, [tarefaId]);

  const adicionar = async () => {
    const conteudo = entradaComentario.trim();

    if (!conteudo || !usuario) return;

    try {
      const novoComentario = await servicoComentarios.criar(tarefaId, conteudo);
      const proximosComentarios = [...comentarios, novoComentario];

      setComentarios(proximosComentarios);
      setEntradaComentario('');
      aoAlterarQuantidade?.(tarefaId, proximosComentarios.length);
    } catch (erro) {
      console.error('Erro ao adicionar comentário:', erro);
    }
  };

  const excluir = async (comentarioId: string) => {
    if (!usuario) return;

    try {
      await servicoComentarios.remover(comentarioId);
      const proximosComentarios = comentarios.filter((comentario) => comentario.id !== comentarioId);

      setComentarios(proximosComentarios);
      aoAlterarQuantidade?.(tarefaId, proximosComentarios.length);
    } catch (erro) {
      console.error('Erro ao excluir comentário:', erro);
    }
  };

  const renderizarComentarios = () => {
    if (carregando) {
      return (
        <div className="text-center text-slate-500 dark:text-slate-400 text-xs py-6">
          Carregando comentários...
        </div>
      );
    }

    if (comentarios.length === 0) {
      return (
        <div className="text-center text-slate-400 dark:text-slate-500 text-xs py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4">
          Nenhum comentário nesta tarefa.
        </div>
      );
    }

    return comentarios.map((comentario) => {
      const iniciais = obterIniciais(comentario.nomeUsuario || 'U');
      const ehAutor = usuario?.id === comentario.usuarioId;

      return (
        <div
          key={comentario.id}
          className="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-2xs relative"
        >
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs"
              style={{ backgroundColor: obterCorAvatar(iniciais) }}
            >
              {iniciais}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {comentario.nomeUsuario}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {formatarDataComentario(comentario.criadoEm)}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 break-words leading-relaxed">
                {comentario.conteudo}
              </p>
              {ehAutor && (
                <button
                  type="button"
                  onClick={() => void excluir(comentario.id)}
                  className="text-[11px] text-rose-500 hover:text-rose-600 mt-2 font-medium cursor-pointer"
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Comentários</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
          {comentarios.length}
        </span>
      </div>

      <div className="space-y-3 mb-4 flex-1 overflow-y-auto pr-1 max-h-[350px]">
        {renderizarComentarios()}
      </div>

      <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={entradaComentario}
          onChange={(evento) => setEntradaComentario(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter') {
              void adicionar();
            }
          }}
          placeholder="Escreva um comentário..."
          className="flex-1 px-3 py-2 bg-white/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 dark:focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={() => void adicionar()}
          disabled={!entradaComentario.trim()}
          aria-label="Enviar comentário"
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-2xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

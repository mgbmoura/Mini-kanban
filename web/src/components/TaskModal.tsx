
// Importa hooks do React, ícones e os tipos e serviços necessários.
import { useState, useEffect } from 'react';
import { X, Trash2, Image as ImageIcon, MessageSquare, Send } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../services/taskService';
import { commentService, Comment } from '../services/commentService';
import { authService } from '../services/authService'; 

// Interface para as propriedades do modal.
interface TaskModalProps {
  task?: Task; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (taskData: Partial<Task> & { commentCount?: number }) => void; // A contagem de comentários é opcionalmente passada aqui
  onDelete?: (taskId: string) => void; 
  defaultStatus?: TaskStatus;
}

// A propriedade onCommentCountUpdate foi REMOVIDA
export function TaskModal({ task, isOpen, onClose, onSave, onDelete, defaultStatus = 'TODO' }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('Média');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachmentImage, setAttachmentImage] = useState('');
  const [imageInput, setImageInput] = useState('');
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (task) { 
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
        setPriority(task.priority || 'Média');
        setTags(task.tags || []);
        setAttachmentImage(task.attachmentImage || '');
        setComments([]); 
        loadComments(); 
      } else { 
        setTitle('');
        setDescription('');
        setStatus(defaultStatus);
        setPriority('Média');
        setTags([]);
        setAttachmentImage('');
        setComments([]);
      }
      setTagInput('');
      setImageInput('');
      setCommentInput('');
    }
  }, [task, isOpen, defaultStatus]);

  const loadComments = async () => {
    if (!task) return;
    setLoadingComments(true);
    try {
      const taskComments = await commentService.getComments(task.id);
      setComments(taskComments);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || !task) return;
    const user = authService.getUser();
    if (!user) return; 

    try {
      const newComment = await commentService.createComment(task.id, commentInput.trim());
      // Apenas atualiza o estado local de comentários
      setComments(prevComments => [...prevComments, newComment]);
      setCommentInput('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const user = authService.getUser();
    if (!user || !task) return;

    try {
      await commentService.deleteComment(commentId);
      // Apenas atualiza o estado local de comentários
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  const formatCommentDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return 'agora mesmo';
    if (diffInMins < 60) return `${diffInMins}m atrás`;
    
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (initials: string): string => {
    const colors = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#fb923c'];
    return colors[initials.charCodeAt(0) % colors.length];
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // SOLUÇÃO: Passa a contagem de comentários correta no momento de salvar
    onSave({ 
      id: task?.id, 
      title, 
      description, 
      status, 
      priority, 
      tags, 
      attachmentImage, 
      commentCount: comments.length // A fonte da verdade
    });
    onClose(); 
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setAttachmentImage(imageInput.trim());
      setImageInput('');
    }
  };

  const handleDelete = () => {
    if (task && onDelete && confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-emerald-600 z-10">
          <h2 className="text-xl font-semibold text-white">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
          <div className="lg:col-span-2 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col h-full">
              
              <div className="flex-grow space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Adicione uma descrição (opcional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="TODO">A Fazer</option>
                      <option value="DOING">Em Andamento</option>
                      <option value="DONE">Concluído</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Prioridade
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Digite uma tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Imagem (URL)
                  </label>
                  {attachmentImage ? (
                    <div className="space-y-2">
                      <img
                        src={attachmentImage}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => setAttachmentImage('')}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remover imagem
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Cole a URL da imagem"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-auto space-y-4">
                {task && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-4 text-center border-t border-slate-200 dark:border-slate-800">
                    <span>Criada em: {new Date(task.createdAt).toLocaleString('pt-BR')}</span>
                    <span className="mx-2">|</span>
                    <span>Última atualização: {new Date(task.updatedAt).toLocaleString('pt-BR')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div>
                    {task && onDelete && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold"
                    >
                      {task ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {task && (
            <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  Comentários ({comments.length})
                </h3>
              </div>

              <div className="space-y-3 mb-4 flex-1 overflow-y-auto pr-2 -mr-2">
                {loadingComments ? (
                  <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-4">
                    Carregando...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-4">
                    Nenhum comentário ainda
                  </div>
                ) : (
                  comments.map((comment) => {
                    const initials = getInitials(comment.userName);
                    const currentUser = authService.getUser();
                    const isOwner = currentUser?.id === comment.userId;

                    return (
                      <div key={comment.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: getAvatarColor(initials) }}
                          >
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {formatCommentDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 break-words">
                              {comment.content}
                            </p>
                            {isOwner && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs text-red-500 hover:text-red-600 mt-2"
                              >
                                Excluir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Adicionar comentário..."
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentInput.trim()}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

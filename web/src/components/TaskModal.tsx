
import { useState, useEffect } from 'react';
import { X, Trash2, Image as ImageIcon, MessageSquare, Send } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../api/task-api';
import { commentApi, Comment } from '../api/comment-api';
import { authService } from '../api/auth-api';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  defaultStatus?: TaskStatus;
}

export function TaskModal({ task, isOpen, onClose, onSave, onDelete, defaultStatus = 'TODO' }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('Média');
  const [tags, setTags] = useState<string[]>([]);
  const [attachmentImage, setAttachmentImage] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
        setPriority(task.priority || 'Média');
        setTags(task.tags || []);
        setAttachmentImage(task.attachmentImage || '');
        loadComments();
      } else {
        resetForm();
      }
    }
  }, [task, isOpen, isEditing]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus(defaultStatus);
    setPriority('Média');
    setTags([]);
    setAttachmentImage('');
    setComments([]);
  };

  const loadComments = async () => {
    if (!task) return;
    setLoadingComments(true);
    try {
      const data = await commentApi.getComments(task.id);
      setComments(data);
    } catch (e) {
      console.error('Falha ao carregar comentários', e);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || !task) return;
    try {
      const newComment = await commentApi.createComment(task.id, commentInput.trim());
      setComments(prev => [...prev, newComment]);
      setCommentInput('');
    } catch (e) {
      console.error('Falha ao adicionar comentário', e);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Tem certeza que quer remover este comentário?')) return;
    try {
      await commentApi.deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error('Falha ao remover comentário', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: task?.id, title, description, status, priority, tags, attachmentImage });
  };

  const getInitials = (name: string = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 bg-muted/50 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className={`grid grid-cols-1 ${isEditing ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-0 flex-1 overflow-hidden`}>
          <div className={`${isEditing ? 'lg:col-span-2' : 'lg:col-span-1'} p-6 overflow-y-auto`}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">TÍTULO *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">DESCRIÇÃO</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-y" />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">URL DA IMAGEM</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={attachmentImage} onChange={(e) => setAttachmentImage(e.target.value)} placeholder="Cole a URL da imagem aqui..." className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">STATUS</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="w-full mt-1.5 p-2.5 bg-background border border-border rounded-lg outline-none appearance-none font-medium">
                    <option value="TODO">A Fazer</option>
                    <option value="DOING">Em Andamento</option>
                    <option value="DONE">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">PRIORIDADE</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="w-full mt-1.5 p-2.5 bg-background border border-border rounded-lg outline-none appearance-none font-medium">
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="pt-5 flex justify-end items-center gap-3 border-t border-border">
                 {isEditing && onDelete && (
                  <button type="button" onClick={() => window.confirm('Tem certeza que deseja excluir esta tarefa?') && onDelete(task.id)} className="text-destructive font-semibold flex items-center gap-2 hover:underline mr-auto">
                    <Trash2 className="w-4 h-4"/> Excluir Tarefa
                  </button>
                )}
                <button type="button" onClick={onClose} className="px-6 py-2.5 border border-border rounded-lg font-bold hover:bg-muted transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">Salvar</button>
              </div>
            </form>
          </div>

          {isEditing && (
            <div className="lg:col-span-1 p-6 bg-muted/30 flex flex-col h-full overflow-hidden border-l border-border">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-foreground"><MessageSquare className="w-5 h-5 text-primary"/> Comentários ({comments.length})</h3>
              <div className="flex-1 overflow-y-auto space-y-4 -mr-2 pr-2 mb-4">
                {loadingComments ? <p className="text-center text-sm text-muted-foreground">Carregando comentários...</p> :
                comments.length === 0 ? <p className="text-center text-sm text-muted-foreground italic">Nenhum comentário ainda.</p> :
                comments.map(c => (
                  <div key={c.id} className="bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{getInitials(c.userName)}</div>
                        <div>
                          <p className="text-sm font-bold">{c.userName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                        </div>
                      </div>
                      {authService.getUser()?.id === c.userId && (
                        <button onClick={() => handleDeleteComment(c.id)} className="text-xs text-destructive font-semibold hover:underline">Remover</button>
                      )}
                    </div>
                    <p className="text-sm text-foreground mt-2.5">{c.content}</p>
                  </div>
                ))
                }
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }} className="flex gap-2 items-center">
                <input value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Adicionar um comentário..." className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"/>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"><Send className="w-4 h-4"/></button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

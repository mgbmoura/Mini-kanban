"use client";

import { useState, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sparkles, 
  Plus, 
  X, 
  Loader2,
  CheckCircle2,
  Tag as TagIcon,
  Image as ImageIcon
} from 'lucide-react';
import { suggestSubtasks } from '@/ai/flows/ai-subtask-suggestion';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (title: string, description: string, subtasks: string[], priority: Priority, tags: string[], attachmentImage?: string) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>('Baixa');
  const [tagsInput, setTagsInput] = useState('');
  const [attachmentImage, setAttachmentImage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setSubtasks(task.subtasks?.map(s => s.title) || []);
      setPriority(task.priority || 'Baixa');
      setTagsInput(task.tags?.join(', ') || '');
      setAttachmentImage(task.attachmentImage || '');
    } else {
      setTitle('');
      setDescription('');
      setSubtasks([]);
      setPriority('Baixa');
      setTagsInput('');
      setAttachmentImage('');
    }
  }, [task, open]);

  const handleAiSuggest = async () => {
    if (!description.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await suggestSubtasks({ taskDescription: description });
      if (result.subtasks) {
        setSubtasks(prev => [...new Set([...prev, ...result.subtasks])]);
      }
    } catch (e) {
      console.error('AI suggestion failed', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const updateSubtask = (index: number, value: string) => {
    const next = [...subtasks];
    next[index] = value;
    setSubtasks(next);
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
    onSave(title, description, subtasks.filter(s => s.trim() !== ''), priority, tags, attachmentImage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 bg-card border-border overflow-hidden">
        <DialogHeader className="p-6 pb-2 bg-secondary/20">
          <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
            {task ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-muted-foreground uppercase">
            {task ? 'Atualize os detalhes da sua demanda' : 'Adicione uma nova meta ao seu quadro'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Título da Tarefa</Label>
              <Input 
                id="title" 
                placeholder="Ex: Refatorar módulo de login" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-secondary/40 border-border/50 h-11 focus-visible:ring-primary font-semibold"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="priority" className="bg-secondary/40 border-border/50 h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Baixa">🔵 Baixa</SelectItem>
                  <SelectItem value="Média">🟡 Média</SelectItem>
                  <SelectItem value="Alta">🔴 Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tags (separadas por vírgula)</Label>
              <div className="relative">
                <TagIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="tags" 
                  placeholder="Design, Dev, Urgente" 
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="pl-10 bg-secondary/40 border-border/50 h-11 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="attachment" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL da Imagem de Anexo (Opcional)</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="attachment" 
                  placeholder="https://exemplo.com/imagem.png" 
                  value={attachmentImage}
                  onChange={e => setAttachmentImage(e.target.value)}
                  className="pl-10 bg-secondary/40 border-border/50 h-11 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Descrição Detalhada</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAiSuggest}
                disabled={isAiLoading || !description.trim()}
                className="h-7 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/10 gap-2 border border-primary/20"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                Sugerir Subtarefas (IA)
              </Button>
            </div>
            <Textarea 
              id="description" 
              placeholder="Descreva o que precisa ser feito..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-[120px] bg-secondary/40 border-border/50 resize-none focus-visible:ring-primary font-medium text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lista de Subtarefas</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddSubtask}
                className="h-7 w-7 p-0 rounded-lg border-border/50 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid gap-3">
              {subtasks.map((st, i) => (
                <div key={i} className="flex items-center gap-3 group animate-in slide-in-from-left-2 duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <Input 
                    value={st} 
                    onChange={e => updateSubtask(i, e.target.value)}
                    placeholder="Nome da subtarefa..."
                    className="h-10 text-sm bg-secondary/20 border-border/30 shadow-none focus-visible:ring-1 focus-visible:ring-primary font-medium"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSubtask(i)}
                    className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {subtasks.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic text-center py-2">Nenhuma subtarefa adicionada.</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/10 border-t border-border/50">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-xs font-bold uppercase tracking-widest">Cancelar</Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-xs font-black uppercase tracking-widest h-11 px-8"
          >
            {task ? 'Salvar Alterações' : 'Confirmar Criação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
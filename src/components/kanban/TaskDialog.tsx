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
  Tag as TagIcon
} from 'lucide-react';
import { suggestSubtasks } from '@/ai/flows/ai-subtask-suggestion';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (title: string, description: string, subtasks: string[], priority: Priority, tags: string[]) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>('Baixa');
  const [tagsInput, setTagsInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setSubtasks(task.subtasks.map(s => s.title));
      setPriority(task.priority || 'Baixa');
      setTagsInput(task.tags?.join(', ') || '');
    } else {
      setTitle('');
      setDescription('');
      setSubtasks([]);
      setPriority('Baixa');
      setTagsInput('');
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
    onSave(title, description, subtasks.filter(s => s.trim() !== ''), priority, tags);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
          <DialogDescription>
            {task ? 'Atualize os detalhes e acompanhe o progresso.' : 'Organize suas metas em passos acionáveis.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title" className="text-sm font-semibold">Título</Label>
              <Input 
                id="title" 
                placeholder="O que precisa ser feito?" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-background focus-visible:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold">Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-semibold">Tags (separadas por vírgula)</Label>
              <div className="relative">
                <TagIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="tags" 
                  placeholder="ex: urgente, figma" 
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-sm font-semibold">Descrição</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAiSuggest}
                disabled={isAiLoading || !description.trim()}
                className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1.5"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Sugerir subtarefas (IA)
              </Button>
            </div>
            <Textarea 
              id="description" 
              placeholder="Descreva a tarefa em detalhes..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-[100px] bg-background resize-none focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Subtarefas</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddSubtask}
                className="h-7 w-7 p-0 rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {subtasks.map((st, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input 
                    value={st} 
                    onChange={e => updateSubtask(i, e.target.value)}
                    placeholder="Título da subtarefa"
                    className="h-8 text-sm bg-background border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary py-0"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSubtask(i)}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {task ? 'Salvar' : 'Criar'} Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Task, Priority } from '@/hooks/use-kanban';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, X, Plus } from 'lucide-react';
import { suggestSubtasks } from '@/ai/flows/suggest-tasks-flow';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: any) => void;
  task?: Task;
}

export function TaskModal({ open, onOpenChange, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setTags(task.tags || []);
      setImage(task.attachmentImage || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Média');
      setTags([]);
      setImage('');
    }
  }, [task, open]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags(tags.filter(tag => tag !== t));

  const handleSuggest = async () => {
    if (!description) return;
    setIsSuggesting(true);
    try {
      const result = await suggestSubtasks({ description });
      setDescription(prev => prev + '\n\nSugestões da IA:\n' + result.subtasks.map(s => `- ${s}`).join('\n'));
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="O que precisa ser feito?" />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Descrição</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary/80 h-7"
                onClick={handleSuggest}
                disabled={isSuggesting || !description}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Sugerir Subtarefas
              </Button>
            </div>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes da tarefa..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Tag..." />
                <Button size="icon" variant="outline" onClick={handleAddTag}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full border border-primary/20">
                {t} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(t)} />
              </span>
            ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">URL da Imagem de Anexo</Label>
            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://exemplo.com/foto.jpg" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => {
            onSave({ title, description, priority, tags, attachmentImage: image });
            onOpenChange(false);
          }}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
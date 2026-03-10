"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { Task, ColumnId, Priority } from '@/lib/types';

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const tasksQuery = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      setTasks(fetchedTasks);
      setIsLoaded(true);
    }, (error) => {
      console.error("Erro ao carregar tarefas:", error);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (
    title: string, 
    description: string, 
    subtasks: string[] = [], 
    priority: Priority = 'Baixa',
    tags: string[] = [],
    attachmentImage?: string
  ) => {
    try {
      const newTask = {
        title,
        description,
        columnId: 'todo' as ColumnId,
        priority,
        tags,
        attachmentImage: attachmentImage || null,
        createdAt: Date.now(),
        subtasks: subtasks.map(s => ({
          id: crypto.randomUUID(),
          title: s,
          completed: false
        }))
      };
      await addDoc(collection(db, 'tasks'), newTask);
    } catch (e) {
      console.error("Erro ao adicionar tarefa:", e);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updates);
    } catch (e) {
      console.error("Erro ao atualizar tarefa:", e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e) {
      console.error("Erro ao deletar tarefa:", e);
    }
  };

  const moveTask = async (id: string, columnId: ColumnId) => {
    await updateTask(id, { columnId });
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    await updateTask(taskId, { subtasks: updatedSubtasks });
  };

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleSubtask
  };
}
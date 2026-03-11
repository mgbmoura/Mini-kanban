'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Priority = 'Baixa' | 'Média' | 'Alta';
export type Status = 'TODO' | 'DOING' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  tags: string[];
  attachmentImage?: string;
  createdAt: any;
  updatedAt: any;
}

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta em tempo real do Firestore
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Garante que tags seja sempre um array
          tags: data.tags || [],
          priority: data.priority || 'Média'
        } as Task;
      });
      setTasks(taskList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar tarefas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (e) {
      console.error("Erro ao adicionar tarefa:", e);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
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

  return { tasks, loading, addTask, updateTask, deleteTask };
}

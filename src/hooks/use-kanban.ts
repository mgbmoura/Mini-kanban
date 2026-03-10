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
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
}
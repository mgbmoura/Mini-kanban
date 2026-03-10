"use client";

import { useState, useEffect } from 'react';
import { Task, ColumnId, SubTask } from '@/lib/types';

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kanflow_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kanflow_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = (title: string, description: string, subtasks: string[] = []) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      columnId: 'todo',
      createdAt: Date.now(),
      subtasks: subtasks.map(s => ({
        id: crypto.randomUUID(),
        title: s,
        completed: false
      }))
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (id: string, columnId: ColumnId) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, columnId } : t));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
      }
      return t;
    }));
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
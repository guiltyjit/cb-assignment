import { create } from 'zustand';
import { type SelectTasks } from '@/lib/db';

type TaskStore = {
  isOpen: boolean;
  mode: 'Add' | 'Edit';
  task: SelectTasks | null;
  openForm: (task?: SelectTasks) => void;
  closeForm: () => void;
};

export const useTaskFormStore = create<TaskStore>((set) => ({
  isOpen: false,
  mode: 'Add',
  task: null,
  closeForm: () =>
    set((state) => ({
      isOpen: false
    })),
  openForm: (task) =>
    set((state) => ({
      isOpen: true,
      mode: task ? 'Edit' : 'Add',
      task: task || null,
    }))
}));

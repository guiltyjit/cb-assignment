'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskFormStore } from '@/store/TaskForm';

export default function NewTaskButton() {
  const { openForm } = useTaskFormStore();

  return (
      <Button size="sm" className="h-8 gap-1" onClick={() => openForm()}>
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Tasks
        </span>
      </Button>
  );
}

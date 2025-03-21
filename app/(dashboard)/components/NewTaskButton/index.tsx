'use client';

import { useState } from 'react';
import { PlusCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

type TaskFormValues = {
  name: string;
  description: string;
  dueDate: string;
  status: 'active' | 'inactive' | 'archived';
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['active', 'inactive', 'archived'], {
    errorMap: () => ({ message: 'Status is required' }),
  }),
});

export default function NewTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async ({name, description, dueDate, status}: TaskFormValues) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          dueDate,
          status,
          // TODO: remove this after using AUTH
          createdBy: 'jun kit'
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast('Failed create new tasks, Server error');
        console.error('Server error:', error);
        return;
      }
  
      const result = await res.json();

      toast('Success create new tasks');
      setIsOpen(false);
      reset();
      // TODO: remove this after state management implemented
      window.location.reload();
    } catch (err) {
      toast('Failed create new tasks, Server error');
      console.error('Fetch failed:', err);
    }
  };

  return (
    <>
      <Button size="sm" className="h-8 gap-1" onClick={() => setIsOpen(true)}>
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Tasks
        </span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Task</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Task Name"
                  {...register('name')}
                  className="w-full border px-3 py-2 rounded"
                />
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              </div>

              <div>
                <textarea
                  placeholder="Description"
                  {...register('description')}
                  className="w-full border px-3 py-2 rounded"
                />
                <p className="text-red-500 text-sm">
                  {errors.description?.message}
                </p>
              </div>

              <div>
                <input
                  type="date"
                  {...register('dueDate')}
                  className="w-full border px-3 py-2 rounded"
                />
                <p className="text-red-500 text-sm">
                  {errors.dueDate?.message}
                </p>
              </div>

              <div>
                <select
                  {...register('status')}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="text-red-500 text-sm">{errors.status?.message}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className="text-gray-600 bg-transparent border border-black hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-white px-4 py-2 rounded flex gap-3 items-center"
                >
                  <Save className="h-3.5 w-3.5 " />
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

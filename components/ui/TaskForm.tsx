'use client';

import { useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useTaskFormStore } from '@/store/TaskForm';

type TaskFormValues = {
  name: string;
  description: string;
  dueDate: string;
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required')
});

export default function TaskForm() {
  const { closeForm, mode, task, isOpen } = useTaskFormStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema)
  });

  const getMethodAndUrl = (): {
    method: 'PUT' | 'POST';
    url: string;
    successMessage: string;
    failedMessage: string;
  } => {
    if (mode === 'Add') {
      return {
        method: 'PUT',
        url: '/api/tasks',
        successMessage: 'Success create new tasks',
        failedMessage: 'Failed create new tasks, Server error'
      };
    }
    return {
      method: 'POST',
      url: `/api/tasks/${task?.id}`,
      successMessage: 'Success update tasks',
      failedMessage: 'Failed update tasks, Server error'
    };
  };

  const onSubmit = async ({ name, description, dueDate }: TaskFormValues) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      const body = JSON.stringify({
        name,
        description,
        dueDate,
        // TODO: remove this after using AUTH
        createdBy: 'jun kit'
      });

      console.log('body => ', body);
      const { url, method, successMessage, failedMessage } = getMethodAndUrl();

      const res = await fetch(url, {
        method,
        headers,
        body
      });
      if (!res.ok) {
        const error = await res.json();
        toast(failedMessage);
        console.error('Server error:', error);
        return;
      }

      const result = await res.json();
      console.log('successMessage => ', successMessage);

      toast(successMessage);
      closeForm();
      reset();
      // TODO: remove this after state management implemented
      // window.location.reload();
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  useEffect(() => {
    if (task) {
      reset({
        name: task.name,
        description: task.description,
        dueDate: task.due_date.toISOString().split('T')[0]
      });
    }
  }, [task, reset]);

  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {mode === 'Add' ? 'New Task' : 'Edit Task'}
          </h2>

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
              <p className="text-red-500 text-sm">{errors.dueDate?.message}</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => {
                  closeForm();
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
    );
  }
}

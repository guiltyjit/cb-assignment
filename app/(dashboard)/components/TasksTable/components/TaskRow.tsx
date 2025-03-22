'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectTasks } from '@/lib/db';
import { useTaskFormStore } from '@/store/TaskForm';
import toast from 'react-hot-toast';

export default function TaskRow({ task }: { task: SelectTasks }) {
  const { openForm } = useTaskFormStore();
  const editHandler = () => {
    openForm(task);
  };
  const deleteHandler = async() => {
    try{
      await fetch(`/api/tasks/${task.id}`, { method: 'delete' });
      toast('Delete Success');
    } catch{
      toast('Failed Delete');
    }
  };
  const { name, description, due_date, status, created_on } = task;

  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell className="font-medium">{description}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {status as string}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">
        {due_date.toLocaleDateString('en-US')}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {created_on.toLocaleDateString('en-US')}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={editHandler}>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteHandler}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

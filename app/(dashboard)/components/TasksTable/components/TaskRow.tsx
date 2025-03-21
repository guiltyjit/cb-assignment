import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectTasks } from '@/lib/db';
import { deleteTasks } from '../../../actions';

export default function TaskRow ({ task: {name, description,due_date, status, created_on} }: { task: SelectTasks }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell className="font-medium">{description}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {status}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{due_date.toLocaleDateString("en-US")}</TableCell>
      <TableCell className="hidden md:table-cell">
        {created_on.toLocaleDateString("en-US")}
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteTasks}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

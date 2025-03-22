'use client';

import { Suspense } from 'react';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import TaskRow from './components/TaskRow';
import { SelectTasks } from '@/lib/db';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import TaskSortingHead from './components/TaskSortingHead';
import Link from 'next/link';

export default function TaskTable({
  tasks,
  totalTasks
}: {
  tasks: SelectTasks[];
  totalTasks: number;
}) {
  const tasksPerPage = 10;
  const searchParams = useSearchParams();
  const allParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    allParams[key] = value;
  });
  const offset = parseInt(allParams?.['offset']) || 0;
  const nextOffSet = offset + tasksPerPage;
  const prevOffSet = offset - tasksPerPage;
  const hasNextPage = nextOffSet < totalTasks;
  const hasPreviousPage = prevOffSet >= 0;

  return (
    <Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Manage your task and view their due date and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Name
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TaskSortingHead sortKey="due_date" />
                <TaskSortingHead sortKey="created_on" />
                <TableHead className="hidden md:table-cell">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <form className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{' '}
              <strong>
                {Math.max(0, Math.min(offset - tasksPerPage, totalTasks) + 1)}-
                {offset}
              </strong>{' '}
              of <strong>{totalTasks}</strong> tasks
            </div>
            <div className="flex gap-10">
              <Link
                href={{
                  pathname: '/',
                  query: { ...allParams, offset: prevOffSet }
                }}
                className={`flex items-center gap-3 ${!hasPreviousPage && 'text-gray-300 cursor-default'}`}
                aria-disabled={!hasPreviousPage}
                onClick={(e) => {
                  if (!hasPreviousPage) {
                    e.preventDefault();
                  }
                }}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Link>
              <Link
                href={{
                  pathname: '/',
                  query: { ...allParams, offset: nextOffSet }
                }}
                className={`flex items-center gap-3 ${!hasNextPage && 'text-gray-300 cursor-default'}`}
                aria-disabled={!hasNextPage}
                onClick={(e) => {
                  if (!hasNextPage) {
                    e.preventDefault();
                  }
                }}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </form>
        </CardFooter>
      </Card>
    </Suspense>
  );
}

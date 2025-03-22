import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TasksTable from '../../components/ui/TasksTable';
import NewTaskButton from '../../components/ui/NewTaskButton';
import TaskForm from '../../components/ui/TaskForm';
import { getTasks } from '@/lib/db';
import type { SortingKey, OrderState } from '@/lib/types';
import { Toaster } from 'react-hot-toast';

export default async function TasksPage(props: {
  searchParams: Promise<{
    keywordSearch: string;
    offset: string;
    sortBy: SortingKey;
    orderBy: OrderState;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { keywordSearch = '', offset = '0', sortBy, orderBy } = searchParams;
  const { tasks, totalTasks } = await getTasks({
    keywordSearch,
    offset: Number(offset),
    sortBy,
    orderBy
  });

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="notUrgent">Not Urgent</TabsTrigger>
          <TabsTrigger value="dueSoon">Due Soon</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <NewTaskButton />
        </div>
      </div>
      <TabsContent value="all">
        <TasksTable
          tasks={tasks}
          totalTasks={totalTasks}
        />
      </TabsContent>
      <TabsContent value="notUrgent">
        <TasksTable
          tasks={tasks.filter(({status})=>status === 'Not Urgent')}
          totalTasks={totalTasks}
        />
      </TabsContent>
      <TabsContent value="dueSoon">
        <TasksTable
          tasks={tasks.filter(({status})=>status === 'Due Soon')}
          totalTasks={totalTasks}
        />
      </TabsContent>
      <TabsContent value="overdue">
        <TasksTable
          tasks={tasks.filter(({status})=>status === 'Overdue')}
          totalTasks={totalTasks}
        />
      </TabsContent>
      <Toaster />
      <TaskForm />
    </Tabs>
  );
}

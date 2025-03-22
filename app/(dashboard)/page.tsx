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
  const { all, notUrgent, dueSoon, overdue } = await getTasks({
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
        <TasksTable {...all} />
      </TabsContent>
      <TabsContent value="notUrgent">
        <TasksTable {...notUrgent} />
      </TabsContent>
      <TabsContent value="dueSoon">
        <TasksTable {...dueSoon} />
      </TabsContent>
      <TabsContent value="overdue">
        <TasksTable {...overdue} />
      </TabsContent>
      <Toaster />
      <TaskForm />
    </Tabs>
  );
}

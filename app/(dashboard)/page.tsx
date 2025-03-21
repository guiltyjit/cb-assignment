import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TasksTable from './components/TasksTable';
import NewTaskButton from './components/NewTaskButton';
import TaskForm from './components/TaskForm';
import { getTasks } from '@/lib/db';
import { Toaster } from 'react-hot-toast';

export default async function ProductsPage(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { tasks, newOffset, totalTasks } = await getTasks(
    search,
    Number(offset)
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
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
          offset={newOffset ?? 0}
          totalTasks={totalTasks}
        />
      </TabsContent>
      <Toaster />
      <TaskForm/>
    </Tabs>
  );
}

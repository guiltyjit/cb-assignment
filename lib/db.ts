import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const taskStatusEnum = pgEnum('task_status', ['active', 'inactive', 'archived']);

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  due_date: timestamp('available_at').notNull(),
  in_charged: text('in_charged').notNull(),
  status: taskStatusEnum('status').notNull(),
  created_by: text('created_by').notNull(),
  created_on: timestamp('created_on').notNull(),
  modify_by: text('modify_by').notNull(),
  last_modify_on: timestamp('last_modify_on').notNull()
});

export type SelectTasks = typeof tasks.$inferSelect;
export const insertTasksSchema = createInsertSchema(tasks);

export async function getTasks(
  search: string,
  offset: number
): Promise<{
  tasks: SelectTasks[];
  newOffset: number | null;
  totalTasks: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      tasks: await db
        .select()
        .from(tasks)
        .where(ilike(tasks.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalTasks: 0
    };
  }

  if (offset === null) {
    return { tasks: [], newOffset: null, totalTasks: 0 };
  }

  let totalTasks = await db.select({ count: count() }).from(tasks);
  let moreTasks = await db.select().from(tasks).limit(5).offset(offset);
  let newOffset = moreTasks.length >= 5 ? offset + 5 : null;

  return {
    tasks: moreTasks,
    newOffset,
    totalTasks: totalTasks[0].count
  };
}

export async function deleteTasksById(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
}

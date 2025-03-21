import 'server-only';

import { sql } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  timestamp,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

const PAGE_SIZE = 10;

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  due_date: timestamp('due_date').notNull(),
  created_by: text('created_by').notNull(),
  created_on: timestamp('created_on').notNull(),
  last_modify_on: timestamp('last_modify_on').notNull()
});

export type SelectTasks = typeof tasks.$inferSelect & {status: unknown};
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
      tasks: await db.select({
        id: tasks.id,
        name: tasks.name,
        description: tasks.description,
        due_date: tasks.due_date,
        created_on: tasks.created_on,
        created_by: tasks.created_by,
        last_modify_on: tasks.last_modify_on,
        status: sql`
          CASE
            WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
            WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
            ELSE 'Not Urgent'
          END
        `.as('status')
      })
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
  let moreTasks = await db.select({
    id: tasks.id,
    name: tasks.name,
    description: tasks.description,
    due_date: tasks.due_date,
    created_on: tasks.created_on,
    created_by: tasks.created_by,
    last_modify_on: tasks.last_modify_on,
    status: sql`
      CASE
        WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
        WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
        ELSE 'Not Urgent'
      END
    `.as('status')
  }).from(tasks).limit(PAGE_SIZE).offset(offset);
  let newOffset = moreTasks.length >= PAGE_SIZE ? offset + PAGE_SIZE : null;

  return {
    tasks: moreTasks,
    newOffset,
    totalTasks: totalTasks[0].count
  };
}

export async function deleteTasksById(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
}

import 'server-only';

import { sql } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  timestamp,
  serial,
  type PgColumn
} from 'drizzle-orm/pg-core';
import { count, eq, ilike, desc } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import type { SortingKey, OrderState } from './types';

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

export type SelectTasks = typeof tasks.$inferSelect & { status: unknown };
export const insertTasksSchema = createInsertSchema(tasks);

interface GetTasksProps {
  keywordSearch?: string;
  offset?: number;
  orderBy?: OrderState;
  sortBy?: SortingKey;
}

interface CategoryTasksResult {
  tasks: SelectTasks[];
  totalTasks: number;
}

interface GetTasksResult {
  all: CategoryTasksResult;
  overdue: CategoryTasksResult;
  dueSoon: CategoryTasksResult;
  notUrgent: CategoryTasksResult;
}

export async function getTasks({
  keywordSearch,
  offset = 0,
  sortBy,
  orderBy
}: GetTasksProps): Promise<GetTasksResult> {
  const sqlStatusString = (endWith?: string) => sql`
      CASE
        WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
        WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
        ELSE 'Not Urgent'
      END ${endWith && `= '${endWith}'`}
    `;
  const dbSelect = db
    .select({
      id: tasks.id,
      name: tasks.name,
      description: tasks.description,
      due_date: tasks.due_date,
      created_on: tasks.created_on,
      created_by: tasks.created_by,
      last_modify_on: tasks.last_modify_on,
      status: sqlStatusString().as('status')
    })
    .from(tasks);

  const totalSelect = db.select({ count: count() }).from(tasks);

  if (keywordSearch) {
    dbSelect.where(ilike(tasks.name, `%${keywordSearch}%`));
    totalSelect.where(ilike(tasks.name, `%${keywordSearch}%`));
  }
  if (sortBy) {
    dbSelect.orderBy(orderBy === 'desc' ? desc(tasks[sortBy]) : tasks[sortBy]);
  }

  return {
    all: {
      tasks: await dbSelect.limit(PAGE_SIZE).offset(offset),
      totalTasks: (await totalSelect)[0].count
    },
    overdue: {
      tasks: await dbSelect
        .where(
          sql`
        CASE
          WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
          WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
          ELSE 'Not Urgent'
        END = 'Overdue'
      `
        )
        .limit(PAGE_SIZE)
        .offset(offset),
      totalTasks: (
        await totalSelect.where(sql`
        CASE
          WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
          WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
          ELSE 'Not Urgent'
        END = 'Overdue'
      `)
      )[0].count
    },
    dueSoon: {
      tasks: await dbSelect
        .where(
          sql`
        CASE
          WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
          WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
          ELSE 'Not Urgent'
        END = 'Due Soon'
      `
        )
        .limit(PAGE_SIZE)
        .offset(offset),
      totalTasks: (
        await totalSelect.where(sql`
        CASE
          WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
          WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
          ELSE 'Not Urgent'
        END = 'Due Soon'
      `)
      )[0].count
    },
    notUrgent: {
      tasks: await dbSelect
        .where(
          sql`
        CASE
          WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
          WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
          ELSE 'Not Urgent'
        END = 'Not Urgent'
      `
        )
        .limit(PAGE_SIZE)
        .offset(offset),
      totalTasks: (
        await totalSelect.where(sql`
        CASE
          WHEN ${tasks.due_date} < CURRENT_DATE THEN 'Overdue'
          WHEN ${tasks.due_date} <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
          ELSE 'Not Urgent'
        END = 'Not Urgent'
      `)
      )[0].count
    }
  };
}

export async function deleteTasksById(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
}

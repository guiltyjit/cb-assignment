import { db, tasks } from 'lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allTasks = await db.select().from(tasks);
    return Response.json(allTasks);
  } catch (error) {
    return new Response('Failed to fetch tasks', { status: 500 });
  }
}

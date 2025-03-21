import { db, tasks } from 'lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allTasks = await db.select().from(tasks);
    return Response.json(allTasks);
  } catch (error) {
    console.log('error => ', error);
    return new Response('Failed to fetch tasks', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { name, description, dueDate, status, createdBy } = data;

    const result = await db.insert(tasks).values({
      name,
      description,
      due_date: new Date(dueDate),
      created_by: createdBy,
      created_on: new Date(),
      last_modify_on: new Date()
    });

    return Response.json({ message: 'New Task created' });
  } catch (error) {
    console.log
    return new Response('Failed to update task', { status: 500 });
  }
}

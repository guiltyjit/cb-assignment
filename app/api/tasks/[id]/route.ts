import { db, tasks } from 'lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Extract ID from URL path

    if (!id) {
      return new Response('Task ID is required', { status: 400 });
    }

    const data = await req.json();
    const { name, description, dueDate, inCharged, status, modifyBy } = data;

    const result = await db
      .update(tasks)
      .set({
        name,
        description,
        due_date: new Date(dueDate),
        in_charged: inCharged,
        status,
        modify_by: modifyBy,
        last_modify_on: new Date()
      })
      .where(eq(tasks.id, Number(id)));

    return Response.json({ message: `Task ID :${id} updated`, result });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update task', { status: 500 });
  }
}

export async function DELETE(req: Request){
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Extract ID from URL path

    if (!id) {
      return new Response('Task ID is required', { status: 400 });
    }

    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, Number(id)));

    return Response.json({ message: `Task ID :${id} deleted`, result });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update task', { status: 500 });
  }
}

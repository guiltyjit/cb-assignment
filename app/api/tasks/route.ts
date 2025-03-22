import { db, tasks } from 'lib/db';
import { Client } from '@upstash/qstash';

const qstash = new Client({
  token: process.env.QSTASH_TOKEN,
});

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
    const { name, description, dueDate, createdBy } = data;

    const result = await db.insert(tasks).values({
      name,
      description,
      due_date: new Date(dueDate),
      created_by: createdBy,
      created_on: new Date(),
      last_modify_on: new Date()
    });

    // qstash.publish({
    //   url: process.env.WORKER_URL || 'https://cb-assignment-teal.vercel.app/api/tasks', // URL of your worker function
    //   body: JSON.stringify( {
    //     name,
    //     description,
    //     due_date: new Date(dueDate),
    //     created_by: createdBy,
    //     created_on: new Date(),
    //     last_modify_on: new Date()
    //   }),
    // });

    return Response.json({ message: 'New Task created' });
  } catch (error) {
    console.log
    return new Response('Failed to update task', { status: 500 });
  }
}

// export async function POST(req: Request){
//   try {
//     const data = req.body;
//     // Perform the actual data processing here
//     console.log('Processing data:', data);

//     // Simulate a time consuming task.
//     await new Promise(resolve => setTimeout(resolve, 5000));

//     console.log('end');

//     // res.status(200).json({ message: 'Job processed successfully.' });
//   } catch (error) {
//     console.error('Error processing job:', error);
//     // res.status(500).json({ error: 'Internal server error' });
//   }
// }

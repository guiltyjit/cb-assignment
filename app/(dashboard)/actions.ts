'use server';

import { deleteTasksById } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteTasks(formData: FormData) {
  // let id = Number(formData.get('id'));
  // await deleteProductById(id);
  // revalidatePath('/');
}

'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAdmin } from '@/firebase/admin';

const requestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  gameName: z.string().min(1, "Game name is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    gameName?: string[];
    notes?: string[];
  };
  success: boolean;
};

export async function sendGameRequest(prevState: FormState, formData: FormData): Promise<FormState> {
  const { db } = await getFirebaseAdmin();
  
  const rawFormData = Object.fromEntries(formData.entries());
  
  const validatedFields = requestSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
      success: false,
    };
  }

  const { userId, name, email, gameName, notes } = validatedFields.data;

  try {
    const gameRequestsCollection = collection(db, 'game_requests');
    await addDoc(gameRequestsCollection, {
      userId,
      name,
      email,
      gameName,
      notes: notes || '',
      platform: 'PC', // Still PC only
      requestDate: serverTimestamp(),
      status: 'pending', // Add a status for tracking
    });
    
    return { success: true, message: 'Your request has been received!' };

  } catch (error) {
    console.error('Failed to send request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, message: `An unexpected error occurred. Please try again later. Details: ${errorMessage}` };
  }
}

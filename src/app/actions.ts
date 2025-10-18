'use server';

import { z } from 'zod';

const requestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  gameName: z.string().min(1, "Game name is required"),
  notes: z.string().optional(),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    gameName?: string[];
    platform?: string[];
    notes?: string[];
  };
  success: boolean;
};

export async function sendGameRequest(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  
  const validatedFields = requestSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
      success: false,
    };
  }

  const { name, email, gameName, notes } = validatedFields.data;

  try {
    // This is a placeholder for the email sending logic (e.g., using Nodemailer or Resend)
    // In a real application, you would integrate an email service here.
    console.log('--- New Game Request ---');
    console.log('To: rafaproject06@gmail.com');
    console.log(`From: ${name} <${email}>`);
    console.log(`Game: ${gameName}`);
    console.log('Platform: PC'); // Always PC
    console.log(`Notes: ${notes || 'N/A'}`);
    console.log('------------------------');

    // Simulate network delay for a better user experience
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: 'Your request has been received!' };

  } catch (error) {
    console.error('Failed to send request:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { updateProfile } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CompleteProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      setFirebaseError('You must be logged in to complete your profile.');
      return;
    }
    setFirebaseError(null);

    try {
      // Update display name in Firebase Auth
      await updateProfile(user, { displayName: data.name });

      // Update profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const profileData = {
        name: data.name,
        profileComplete: true,
      };

      updateDoc(userDocRef, profileData).catch(error => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: profileData
        }));
      });

      router.push('/');
    } catch (error: any) {
      setFirebaseError(error.message);
    }
  }
  
  if (isUserLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
        <Icons.loader className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-lg tracking-wider">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-black/30 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20">
        <div className="p-8 md:p-12 space-y-6">
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-wider uppercase text-shadow-glow">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Please enter your name to continue.
            </p>
          </div>

          {firebaseError && <p className="text-destructive text-sm text-center">{firebaseError}</p>}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground/80">Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field}
                        className="bg-input/50 border-primary/50 focus:ring-primary/80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full font-bold tracking-wider uppercase bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 hover:scale-105"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save and Continue'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Icons } from './icons';
import { useUser, useFirestore } from '@/firebase';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface RequestGameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  gameName?: string;
  onSuccess: () => void;
}

const requestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  gameName: z.string().min(2, "Game name is required."),
  notes: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export function RequestGameDialog({ isOpen, setIsOpen, gameName, onSuccess }: RequestGameDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: '',
      email: '',
      gameName: gameName || '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: user?.displayName || '',
        email: user?.email || '',
        gameName: gameName || '',
        notes: '',
      });
    }
  }, [isOpen, gameName, form, user]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };
  
  const onSubmit = async (data: RequestFormValues) => {
    if (!user || !firestore) {
      toast({
        title: "Error",
        description: "You must be logged in to make a request.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const gameRequestRef = collection(firestore, 'game_requests');
      const requestData = {
        userId: user.uid,
        name: data.name,
        email: data.email,
        gameName: data.gameName,
        notes: data.notes || '',
        platform: 'PC',
        requestDate: serverTimestamp(),
        status: 'pending',
      };
      
      await addDoc(gameRequestRef, requestData);

      onSuccess();
      form.reset();
      toast({
        title: "Request Submitted!",
        description: "After your request, go to Discord and open a ticket. We will be with you shortly.",
      });

    } catch (error: any) {
       // We assume any error here is a permission error until proven otherwise
      const permissionError = new FirestorePermissionError({
          path: 'game_requests',
          operation: 'create',
          requestResourceData: { request: data },
        });
      errorEmitter.emit('permission-error', permissionError);

      // We still show a toast to the user, as the global error handler is for dev visibility
      toast({
          title: "Error Submitting Request",
          description: "There was a problem submitting your request. Please try again later.",
          variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-background/80 backdrop-blur-xl border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-shadow-glow">Request a Game</DialogTitle>
          <DialogDescription>
            After your request, go to Discord and open a ticket. We will be with you shortly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gameName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Elden Ring" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any specific version or details?" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-bold tracking-wider uppercase" disabled={isSubmitting || !user}>
               {isSubmitting && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Sending Request...' : 'Submit Request'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

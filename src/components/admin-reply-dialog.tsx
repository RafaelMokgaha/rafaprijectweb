
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Icons } from './icons';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface GameRequest {
    id: string;
    userId: string;
    gameName: string;
    name: string;
    email: string;
}

interface AdminReplyDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  request: GameRequest;
  onSuccess: () => void;
}

const replySchema = z.object({
  body: z.string().min(10, "Message body must be at least 10 characters."),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export function AdminReplyDialog({ isOpen, setIsOpen, request, onSuccess }: AdminReplyDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      body: ``,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        body: `Hi ${request.name},\n\nRegarding your request for ${request.gameName}...\n\n`,
      });
    }
  }, [isOpen, request, form]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };
  
  const onSubmit = async (data: ReplyFormValues) => {
    if (!firestore) {
      toast({ title: "Error", description: "Firestore not available.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);

    const messagesCollection = collection(firestore, `users/${request.userId}/messages`);

    const messageData = {
      receiverId: request.userId,
      subject: `Re: Your game request for ${request.gameName}`,
      body: data.body,
      sentAt: serverTimestamp(),
      isRead: false,
      gameRequestId: request.id,
    };

    addDoc(messagesCollection, messageData)
      .then(() => {
        onSuccess();
        form.reset();
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
        
        // This is the important part: we create and emit a detailed error
        // for our listener to catch and display.
        const permissionError = new FirestorePermissionError({
          path: messagesCollection.path,
          operation: 'create',
          requestResourceData: messageData,
        });
        errorEmitter.emit('permission-error', permissionError);

        // We also show a toast to the user, as a fallback.
        toast({
            title: "Error Sending Reply",
            description: "You do not have permission to send this message. Please check the security rules.",
            variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-background/80 backdrop-blur-xl border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-shadow-glow">Reply to {request.name}</DialogTitle>
          <DialogDescription>
            Your message will be sent to the user's in-app inbox.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your reply..." {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-bold tracking-wider uppercase" disabled={isSubmitting}>
               {isSubmitting && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

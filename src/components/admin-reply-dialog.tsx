
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Icons } from './icons';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { FirestorePermissionError, errorEmitter } from '@/firebase';

interface AdminReplyDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  request: {
    id: string;
    userId: string;
    gameName: string;
    name: string;
  } | null;
}

const replySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Message body is required"),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export function AdminReplyDialog({ isOpen, setIsOpen, request }: AdminReplyDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      subject: '',
      body: '',
    },
  });

  useEffect(() => {
    if (request) {
      form.reset({
        subject: `Re: Your game request for ${request.gameName}`,
        body: `Hi ${request.name},\n\nRegarding your request for ${request.gameName}...\n\n`,
      });
    }
  }, [request, form]);

  const onSubmit = async (data: ReplyFormValues) => {
    if (!firestore || !request) {
      toast({
        title: "Error",
        description: "Cannot send message. Invalid request or database connection.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    const messagesCollection = collection(firestore, `users/${request.userId}/messages`);
    const messageData = {
      receiverId: request.userId,
      subject: data.subject,
      body: data.body,
      sentAt: serverTimestamp(),
      isRead: false,
      gameRequestId: request.id,
    };
    
    // Non-blocking write: addDoc returns a promise but we chain .catch
    addDoc(messagesCollection, messageData)
      .then(() => {
        // If addDoc is successful, proceed to delete the game request
        const gameRequestRef = doc(firestore, 'game_requests', request.id);
        
        return deleteDoc(gameRequestRef).catch((deleteError) => {
          // This will catch a permissions error on the deleteDoc call
          const permissionError = new FirestorePermissionError({
            path: gameRequestRef.path,
            operation: 'delete',
          });
          errorEmitter.emit('permission-error', permissionError);
          // Re-throw to prevent the success toast from showing
          throw permissionError; 
        });
      })
      .then(() => {
        // This runs only if both addDoc and deleteDoc were successful
        toast({
          title: "Message Sent & Request Removed!",
          description: `Your reply has been sent and the request for "${request.gameName}" has been removed.`,
        });
        setIsOpen(false);
        form.reset();
      })
      .catch((error) => {
        // This will catch a permissions error on the addDoc call, or a thrown error from deleteDoc's catch
        if (!(error instanceof FirestorePermissionError)) {
          const permissionError = new FirestorePermissionError({
            path: messagesCollection.path,
            operation: 'create',
            requestResourceData: messageData,
          });
          errorEmitter.emit('permission-error', permissionError);
        }
        // We don't show a toast here because the global error listener will show the overlay.
      })
      .finally(() => {
        // This will run regardless of success or failure
        setIsSubmitting(false);
      });
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px] bg-background/80 backdrop-blur-xl border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-shadow-glow">Reply to Request</DialogTitle>
          <DialogDescription>
            Send a message to {request?.name || 'the user'} regarding their request for {request?.gameName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your message here..." {...field} rows={6} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full font-bold tracking-wider uppercase" disabled={isSubmitting}>
                {isSubmitting && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Sending...' : 'Send Message & Remove Request'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

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
import { useFirestore, useStorage } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

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
  attachment: z.any().optional(),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export function AdminReplyDialog({ isOpen, setIsOpen, request }: AdminReplyDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      subject: '',
      body: '',
      attachment: undefined,
    },
  });

  const attachmentRef = form.register("attachment");

  useEffect(() => {
    if (request) {
      form.reset({
        subject: `Re: Your game request for ${request.gameName}`,
        body: `Hi ${request.name},\n\nRegarding your request for ${request.gameName}...\n\n`,
        attachment: undefined,
      });
    }
  }, [request, form]);

  const onSubmit = async (data: ReplyFormValues) => {
    if (!firestore || !request || !storage) {
      toast({
        title: "Error",
        description: "Cannot send message. Invalid request or database/storage connection.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      let attachmentUrl: string | null = null;
      let attachmentName: string | null = null;
      const file = data.attachment?.[0];

      if (file) {
        const fileId = uuidv4();
        const storageRef = ref(storage, `message_attachments/${request.userId}/${fileId}-${file.name}`);
        
        toast({ title: "Uploading file...", description: "Please wait." });
        const uploadResult = await uploadBytes(storageRef, file);
        attachmentUrl = await getDownloadURL(uploadResult.ref);
        attachmentName = file.name;
        toast({ title: "Upload complete!", description: "File is attached." });
      }

      const messagesCollection = collection(firestore, `users/${request.userId}/messages`);
      
      const messageData: any = {
        receiverId: request.userId,
        subject: data.subject,
        body: data.body,
        sentAt: serverTimestamp(),
        isRead: false,
        gameRequestId: request.id,
      };

      if (attachmentUrl && attachmentName) {
        messageData.attachmentUrl = attachmentUrl;
        messageData.attachmentName = attachmentName;
      }

      await addDoc(messagesCollection, messageData);

      toast({
        title: "Message Sent!",
        description: `Your reply has been sent to ${request.name}.`,
      });
      
      setIsOpen(false);
      form.reset();

    } catch (error) {
       console.error("Error sending message: ", error);
       toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                 <FormItem>
                  <FormLabel>Attachment (Optional)</FormLabel>
                  <FormControl>
                    <Input type="file" {...attachmentRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full font-bold tracking-wider uppercase" disabled={isSubmitting}>
                {isSubmitting && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

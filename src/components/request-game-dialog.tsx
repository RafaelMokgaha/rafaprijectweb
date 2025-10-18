'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendGameRequest, type FormState } from '@/app/actions';
import { Icons } from './icons';
import { useUser } from '@/firebase';

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
  
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useActionState(sendGameRequest, initialState);

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

  useEffect(() => {
    if (state.success) {
      onSuccess(); // Call the onSuccess callback instead of showing toast directly
      form.reset();
    } else if (state.message && (state.errors || !state.success)) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, form, onSuccess]);
  
  const isSubmitting = form.formState.isSubmitting;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };
  
  const handleFormAction = (formData: FormData) => {
    if (user) {
      formData.append('userId', user.uid);
      formAction(formData);
    } else {
      toast({
        title: "Error",
        description: "You must be logged in to make a request.",
        variant: "destructive",
      });
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-background/80 backdrop-blur-xl border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-shadow-glow">Request a Game</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll look into it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={handleFormAction} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage>{state.errors?.name}</FormMessage>
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
                  <FormMessage>{state.errors?.email}</FormMessage>
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
                  <FormMessage>{state.errors?.gameName}</FormMessage>
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
                   <FormMessage>{state.errors?.notes}</FormMessage>
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

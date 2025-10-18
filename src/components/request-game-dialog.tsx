'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendGameRequest, type FormState } from '@/app/actions';
import type { User } from '@/lib/types';
import { Icons } from './icons';

interface RequestGameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User;
  gameName?: string;
}

const requestSchema = z.object({
  name: z.string(),
  email: z.string(),
  gameName: z.string().min(2, "Game name is required."),
  platform: z.string().min(1, "Please select a platform."),
  notes: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export function RequestGameDialog({ isOpen, setIsOpen, user, gameName }: RequestGameDialogProps) {
  const { toast } = useToast();
  
  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useFormState(sendGameRequest, initialState);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      gameName: gameName || '',
      platform: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (gameName) {
      form.setValue('gameName', gameName);
    }
  }, [gameName, form]);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Request Sent!",
        description: state.message,
      });
      setIsOpen(false);
      form.reset();
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, setIsOpen, form]);
  
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px] bg-background/80 backdrop-blur-xl border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-shadow-glow">Request a Game</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll look into it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
             <input type="hidden" {...form.register('name')} value={user.name} />
             <input type="hidden" {...form.register('email')} value={user.email} />

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
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="PS4/5">PS4/5</SelectItem>
                      <SelectItem value="Xbox">Xbox</SelectItem>
                      <SelectItem value="Switch">Switch</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{state.errors?.platform}</FormMessage>
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

            <Button type="submit" className="w-full font-bold tracking-wider uppercase" disabled={isSubmitting}>
               {isSubmitting && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Sending Request...' : 'Submit Request'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

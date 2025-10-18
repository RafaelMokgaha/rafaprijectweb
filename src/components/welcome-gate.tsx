'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowRight } from 'lucide-react';

const welcomeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type WelcomeFormValues = z.infer<typeof welcomeSchema>;

interface WelcomeGateProps {
  onLogin: (name: string, email: string) => void;
}

export function WelcomeGate({ onLogin }: WelcomeGateProps) {
  const form = useForm<WelcomeFormValues>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: { name: "", email: "" },
  });

  function onSubmit(data: WelcomeFormValues) {
    onLogin(data.name, data.email);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-black/30 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20">
        <div className="p-8 md:p-12 space-y-6">
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-wider uppercase text-shadow-glow">WELCOME TO RAFA PROJECT</h1>
            <p className="text-muted-foreground mt-2">Please enter your details to continue to the gaming experience</p>
          </div>

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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground/80">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="your.email@example.com" 
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
                className="w-full font-bold tracking-wider uppercase bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/50 hover:scale-105"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Entering...' : 'Enter Gaming Zone'}
                {!form.formState.isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </Form>
           <p className="text-center text-xs text-muted-foreground">
            Your information helps us provide a personalized gaming experience
          </p>
        </div>
      </div>
    </div>
  );
}

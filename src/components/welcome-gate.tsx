'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { placeHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const welcomeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type WelcomeFormValues = z.infer<typeof welcomeSchema>;

interface WelcomeGateProps {
  onLogin: (name: string, email: string) => void;
}

export function WelcomeGate({ onLogin }: WelcomeGateProps) {
  const logo = placeHolderImages.find(p => p.id === 'logo');
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
          <div className="flex justify-center">
            {logo && (
              <Image
                src={logo.imageUrl}
                alt="RAFA PROJECT Logo"
                width={150}
                height={75}
                priority
                className="h-auto"
                data-ai-hint={logo.imageHint}
              />
            )}
          </div>
          <div className="text-center">
            <h1 className="font-headline text-2xl font-bold tracking-wider text-shadow-glow">ACCESS PLATFORM</h1>
            <p className="text-muted-foreground mt-2">Enter your details to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground/80">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your Name" 
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
                        placeholder="your@email.com" 
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
                className="w-full font-bold tracking-wider uppercase shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 hover:scale-105"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Entering...' : 'Enter'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password is required." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

export function WelcomeGate() {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const auth = useAuth();

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSignUp(data: SignUpFormValues) {
    setFirebaseError(null);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      // User will be automatically signed in and the main app will render via the onAuthStateChanged listener
    } catch (error: any) {
      setFirebaseError(error.message);
    }
  }

  async function onSignIn(data: SignInFormValues) {
    setFirebaseError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
       // User will be automatically signed in and the main app will render via the onAuthStateChanged listener
    } catch (error: any) {
      setFirebaseError(error.message);
    }
  }
  
  const form = isSigningUp ? signUpForm : signInForm;
  const onSubmit = isSigningUp ? onSignUp : onSignIn;
  type FormValues = typeof isSigningUp extends true ? SignUpFormValues : SignInFormValues;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-black/30 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20">
        <div className="p-8 md:p-12 space-y-6">
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-wider uppercase text-shadow-glow">
              {isSigningUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSigningUp ? 'Join the RAFA Project to request games.' : 'Sign in to continue.'}
            </p>
          </div>
          
          {firebaseError && <p className="text-destructive text-sm text-center">{firebaseError}</p>}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
              {isSigningUp && (
                <FormField
                  control={signUpForm.control}
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
              )}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground/80">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="••••••••" 
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
                {form.formState.isSubmitting 
                  ? (isSigningUp ? 'Creating Account...' : 'Signing In...')
                  : (isSigningUp ? 'Sign Up' : 'Sign In')
                }
                {!form.formState.isSubmitting && (isSigningUp ? <UserPlus className="ml-2 h-5 w-5" /> : <LogIn className="ml-2 h-5 w-5" />)}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button variant="link" onClick={() => setIsSigningUp(!isSigningUp)} className="text-muted-foreground hover:text-primary-foreground">
              {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </div>

           <p className="text-center text-xs text-muted-foreground">
            Your information is secured with Firebase Authentication.
          </p>
        </div>
      </div>
    </div>
  );
}

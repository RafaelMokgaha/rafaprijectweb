'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  const router = useRouter();
  const { user } = useUser();

  const logoImage = placeHolderImages.find(p => p.id === 'logo');
  
  useEffect(() => {
    // If the user is logged in, redirect them to the home page.
    if (user) {
      router.push('/');
    }
  }, [user, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      // No need to redirect here, the useEffect will handle it.
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: "Invalid email or password. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      await updateProfile(userCredential.user, {
        displayName: signupName,
      });
      toast({
        title: 'Sign Up Successful',
        description: 'Your account has been created.',
      });
       // No need to redirect here, the useEffect will handle it.
    } catch (error: any) {
      let description = "An unexpected error occurred during sign-up. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = 'An account with this email already exists. Please log in or use a different email.';
      } else if (error.code === 'auth/invalid-email') {
        description = 'The email address is not valid. Please enter a valid email.';
      } else if (error.code === 'auth/weak-password') {
        description = 'The password is too weak. Please choose a stronger password.';
      }
      
      toast({
        title: 'Sign Up Failed',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
       <div className="w-full max-w-md mx-auto">
         {logoImage && (
            <div className="flex justify-center mb-8">
                <Image 
                    src={logoImage.imageUrl} 
                    alt={logoImage.description} 
                    width={200} 
                    height={100}
                    className="object-contain"
                    data-ai-hint={logoImage.imageHint}
                />
            </div>
         )}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="bg-card/80 backdrop-blur-sm">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to access the RAFA Project Launcher.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="m@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
                    Log In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="bg-card/80 backdrop-blur-sm">
              <form onSubmit={handleSignUp}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
                  <CardDescription>
                    Enter your details to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="m@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

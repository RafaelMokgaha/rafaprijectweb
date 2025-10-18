'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { WelcomeGate } from '@/components/welcome-gate';
import { MainContent } from '@/components/main-content';
import { Icons } from '@/components/icons';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    try {
      const userJson = localStorage.getItem('rafa_project_user');
      if (userJson) {
        const storedUser = JSON.parse(userJson);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Could not parse user from localStorage", error);
      // Ensure bad data is cleared
      localStorage.removeItem('rafa_project_user');
    }
    // Finished checking for user, stop loading
    setLoading(false);
  }, []);

  const handleLogin = (name: string, email: string) => {
    const userData = { name, email };
    try {
      localStorage.setItem('rafa_project_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
        console.error("Could not set user to localStorage", error);
    }
  };

  // While checking for the user, show a full-screen loading indicator.
  // This prevents any content from flashing.
  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
        <Icons.loader className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-lg tracking-wider">Loading Project...</p>
      </div>
    );
  }

  // After loading, if there's no user, show the login gate.
  if (!user) {
    return <WelcomeGate onLogin={handleLogin} />;
  }

  // If there is a user, show the main content.
  return <MainContent user={user} />;
}

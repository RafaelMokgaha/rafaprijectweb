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
    let storedUser: User | null = null;
    try {
      const userJson = localStorage.getItem('rafa_project_user');
      if (userJson) {
        storedUser = JSON.parse(userJson);
      }
    } catch (error) {
      console.error("Could not parse user from localStorage", error);
      localStorage.removeItem('rafa_project_user');
    }
    
    if (storedUser) {
      setUser(storedUser);
    } else {
      // If no user, create a default one to bypass WelcomeGate
      const defaultUser = { name: 'Guest', email: 'guest@example.com' };
      try {
        localStorage.setItem('rafa_project_user', JSON.stringify(defaultUser));
        setUser(defaultUser);
      } catch (error) {
        console.error("Could not set default user to localStorage", error);
        setUser(defaultUser); // still set user for current session
      }
    }

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

  if (loading || !user) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
        <Icons.loader className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-lg tracking-wider">Loading Project...</p>
      </div>
    );
  }

  return <MainContent user={user} />;
}

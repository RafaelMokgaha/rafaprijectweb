'use client';

import { WelcomeGate } from '@/components/welcome-gate';
import { MainContent } from '@/components/main-content';
import { Icons } from '@/components/icons';
import { useUser } from '@/firebase';

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
        <Icons.loader className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-lg tracking-wider">Loading Project...</p>
      </div>
    );
  }

  if (!user) {
    return <WelcomeGate />;
  }

  return <MainContent user={user} />;
}

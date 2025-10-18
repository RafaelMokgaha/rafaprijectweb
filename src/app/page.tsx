'use client';

import { useEffect } from 'react';
import { WelcomeGate } from '@/components/welcome-gate';
import { MainContent } from '@/components/main-content';
import { Icons } from '@/components/icons';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ profileComplete?: boolean }>(userDocRef);

  useEffect(() => {
    if (!isUserLoading && user && !isProfileLoading) {
      // The profile might not exist yet (userProfile is null) or it might be incomplete.
      // In either case, if `profileComplete` isn't explicitly true, we redirect.
      if (!userProfile?.profileComplete) {
        router.push('/complete-profile');
      }
    }
  }, [isUserLoading, user, isProfileLoading, userProfile, router]);


  // Show initial loading screen while checking auth status or fetching profile
  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
        <Icons.loader className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-lg tracking-wider">Verifying access...</p>
      </div>
    );
  }

  // If no user is logged in after checks, show the login gate.
  if (!user) {
    return <WelcomeGate />;
  }

  // If a user is logged in and their profile is complete, show the main content.
  if (user && userProfile?.profileComplete) {
    return <MainContent user={user} />;
  }

  // Fallback for any intermediate state, like redirecting.
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
      <Icons.loader className="h-12 w-12 animate-spin text-primary" />
      <p className="font-headline text-lg tracking-wider">Loading Project...</p>
    </div>
  );
}

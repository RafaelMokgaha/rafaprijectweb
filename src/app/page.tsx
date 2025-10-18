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

  // Memoize the document reference to prevent re-renders
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  // useDoc hook to get user profile data in real-time
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ profileComplete: boolean }>(userDocRef);

  useEffect(() => {
    // Redirect logic: if user is loaded, authenticated, and profile is fetched but incomplete
    if (!isUserLoading && user && !isProfileLoading && userProfile && !userProfile.profileComplete) {
      router.push('/complete-profile');
    }
  }, [isUserLoading, user, isProfileLoading, userProfile, router]);


  // Show loading screen while checking auth or profile
  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
        <Icons.loader className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-lg tracking-wider">Loading Project...</p>
      </div>
    );
  }

  // If no user, show the login/signup gate
  if (!user) {
    return <WelcomeGate />;
  }

  // If user exists but profile is incomplete, show a redirecting message
  if (userProfile && !userProfile.profileComplete) {
     return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
            <Icons.loader className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-lg tracking-wider">Redirecting to complete profile...</p>
        </div>
    );
  }
  
  // If user and profile are complete, show the main content
  if (user && userProfile?.profileComplete) {
    return <MainContent user={user} />;
  }

  // Fallback loading screen
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
      <Icons.loader className="h-12 w-12 animate-spin text-primary" />
      <p className="font-headline text-lg tracking-wider">Verifying access...</p>
    </div>
  );
}

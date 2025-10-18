'use client';

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

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ profileComplete: boolean }>(userDocRef);

  if (isUserLoading || (user && isProfileLoading)) {
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

  if (user && userProfile && !userProfile.profileComplete) {
    router.push('/complete-profile');
    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
            <Icons.loader className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-lg tracking-wider">Redirecting to complete profile...</p>
        </div>
    );
  }
  
  if (user && userProfile?.profileComplete) {
    return <MainContent user={user} />;
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-primary-foreground gap-4">
      <Icons.loader className="h-12 w-12 animate-spin text-primary" />
      <p className="font-headline text-lg tracking-wider">Loading Project...</p>
    </div>
  );
}

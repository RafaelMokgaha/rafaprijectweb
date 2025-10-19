
'use client';

import { AuthGate } from '@/app/auth-gate';
import { MainContent } from '@/components/main-content';
import { useUser } from '@/firebase';

export default function HomePage() {
  const { isUserLoading } = useUser();

  // Show a loading indicator while the user state is being determined.
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthGate>
      <MainContent />
    </AuthGate>
  );
}

'use client';

import { MainContent } from '@/components/main-content';
import { AuthGate } from '@/app/auth-gate';

export default function Home() {
  return (
    <AuthGate>
      <MainContent />
    </AuthGate>
  );
}

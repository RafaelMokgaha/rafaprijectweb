
'use client';

import { useUser, useAuth } from '@/firebase';
import { AuthGate } from '@/app/auth-gate';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { AdminDashboard, NotAuthorized } from '@/components/admin-dashboard';

const ADMIN_EMAIL = 'rafaproject06@gmail.com';

function Dashboard() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };
  
  return (
    <>
      <Header>
         {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-foreground">Welcome, Admin</span>
            <Button variant="outline" size="sm" asChild>
                <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </Header>
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </>
  );
}

export default function AdminDashboardPage() {
    const { user } = useUser();
    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    return (
        <AuthGate>
            {isAdmin ? <Dashboard /> : <NotAuthorized />}
        </AuthGate>
    )
}

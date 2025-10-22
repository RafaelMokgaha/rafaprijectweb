
'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from '@/firebase';
import { AuthGate } from '@/app/auth-gate';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface GameRequest {
  id: string;
  gameName: string;
  name: string;
  email: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: any;
  notes?: string;
}

const ADMIN_EMAIL = 'rafaproject06@gmail.com';

function AdminPanel() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const { user } = useUser();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'game_requests'), orderBy('requestDate', 'desc'));
  }, [firestore]);

  const { data: requests, isLoading, error } = useCollection<GameRequest>(requestsQuery);

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };
  
  const formatDate = (timestamp: any) => {
    if (timestamp && timestamp.toDate) {
      return format(timestamp.toDate(), 'PPP p');
    }
    return 'Date not available';
  }

  const getStatusVariant = (status: GameRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  return (
    <>
      <Header>
         {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-foreground">Admin: {user.displayName || user.email}</span>
            <Button variant="outline" size="sm" asChild>
                <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link href="/inbox">Inbox</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </Header>
      <main className="container mx-auto px-4 py-8">
        <SectionWrapper>
          <SectionTitle>Game Requests</SectionTitle>
          {isLoading && <p className="text-center">Loading requests...</p>}
          {error && <p className="text-center text-destructive">Error: {error.message}</p>}
          {requests && !isLoading && (
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
                {requests.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Game Name</TableHead>
                                <TableHead>Requester</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.gameName}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{req.name}</div>
                                        <div className="text-sm text-muted-foreground">{req.email}</div>
                                    </TableCell>
                                    <TableCell>{formatDate(req.requestDate)}</TableCell>
                                    <TableCell>{req.platform}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No game requests yet.</p>
                )}
            </div>
          )}
        </SectionWrapper>
      </main>
    </>
  );
}


function AccessDenied() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <SectionWrapper className='text-center'>
                <SectionTitle>Access Denied</SectionTitle>
                <p className="text-muted-foreground mb-8">You do not have permission to view this page.</p>
                <Button onClick={() => router.push('/')}>Go to Homepage</Button>
            </SectionWrapper>
        </div>
    )
}

function AdminGate({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    
    if (isUserLoading) {
        return <div className="flex items-center justify-center h-screen text-2xl">Loading...</div>;
    }
    
    if (user?.email !== ADMIN_EMAIL) {
        return <AccessDenied />;
    }
    
    return <>{children}</>;
}


export default function AdminPage() {
    return (
        <AuthGate>
            <AdminGate>
                <AdminPanel />
            </AdminGate>
        </AuthGate>
    )
}


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

function AdminPanel() {
  const firestore = useFirestore();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

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


export default function AdminPage() {
    // Note: This page should be protected so only admins can view it.
    // Future work can involve adding user roles and claims to secure this route.
    return (
        <AuthGate>
            <AdminPanel />
        </AuthGate>
    )
}

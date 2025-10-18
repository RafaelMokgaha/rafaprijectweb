'use client';

import { useMemo, useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useAuth } from '@/firebase';
import { AuthGate } from '@/app/auth-gate';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import Link from 'next/link';
import { AdminReplyDialog } from '@/components/admin-reply-dialog';

interface GameRequest {
    id: string;
    userId: string;
    gameName: string;
    name: string;
    email: string;
    status: string;
    requestDate: any;
    notes: string;
}

function AdminDashboard() {
  const firestore = useFirestore();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GameRequest | null>(null);

  const gameRequestsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'game_requests');
  }, [firestore]);

  const { data: gameRequests, isLoading, error } = useCollection<GameRequest>(gameRequestsQuery);

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

  const handleReplyClick = (request: GameRequest) => {
    setSelectedRequest(request);
    setIsReplyDialogOpen(true);
  }

  return (
    <>
      <AdminReplyDialog
        isOpen={isReplyDialogOpen}
        setIsOpen={setIsReplyDialogOpen}
        request={selectedRequest}
      />
      <Header>
         {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-foreground">Welcome, {user.displayName || user.email}</span>
            <Button variant="outline" size="sm" asChild>
                <Link href="/">Home</Link>
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
          {gameRequests && !isLoading && (
            <div className="overflow-x-auto rounded-lg border border-primary/20 bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Name</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameRequests.length > 0 ? (
                    gameRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.gameName}</TableCell>
                        <TableCell>{req.name}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>
                          <Badge variant={req.status === 'pending' ? 'secondary' : 'default'}>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(req.requestDate)}</TableCell>
                        <TableCell className="max-w-xs truncate">{req.notes || 'N/A'}</TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleReplyClick(req)}>Reply</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No game requests yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionWrapper>
      </main>
    </>
  );
}


export default function AdminPage() {
    return (
        <AuthGate>
            <AdminDashboard />
        </AuthGate>
    )
}


'use client';

import { useState } from 'react';
import { collection, query, orderBy, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from '@/firebase';
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
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GameRequest {
    id: string;
    userId: string;
    gameName: string;
    name: string;
    email: string;
    status: string;
    requestDate: any;
    notes: string;
    messageId?: string; // Optional messageId to link request to the auto-reply
}

const ADMIN_EMAIL = 'rafaproject06@gmail.com';

function AdminDashboard() {
  const firestore = useFirestore();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const gameRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'game_requests'), orderBy('requestDate', 'desc'));
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

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'solved':
        return 'default';
      default:
        return 'outline';
    }
  }
  
  const handleDeleteRequest = async (request: GameRequest) => {
    if (!firestore || !user) return;
    try {
        const batch = writeBatch(firestore);

        // 1. Reference and delete the game request
        const gameRequestRef = doc(firestore, 'game_requests', request.id);
        batch.delete(gameRequestRef);

        // 2. Reference and delete the associated message, if it exists
        if (request.messageId) {
            const messageRef = doc(firestore, `users/${request.userId}/messages`, request.messageId);
            batch.delete(messageRef);
        }

        // Commit the batch
        await batch.commit();

        toast({
            title: "Request Deleted",
            description: "The game request and associated message have been deleted.",
        });
    } catch (e) {
        console.error("Error deleting request: ", e);
        toast({
            title: "Error",
            description: "Could not delete the request. Please check permissions.",
            variant: "destructive",
        });
    }
  }


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
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameRequests.length > 0 ? (
                    gameRequests.map((req) => {
                      return (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">{req.gameName}</TableCell>
                          <TableCell>{req.name}</TableCell>
                          <TableCell>
                             <Badge variant={getStatusVariant(req.status)}>
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(req.requestDate)}</TableCell>
                           <TableCell>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the game request
                                        and the associated message from the user's inbox.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteRequest(req)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
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

function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-4xl font-headline font-bold text-destructive">Access Denied</h1>
        <p className="mt-2 text-lg text-muted-foreground">You do not have permission to view this page.</p>
        <Button asChild className="mt-6">
            <Link href="/">Return to Home</Link>
        </Button>
    </div>
  )
}


export default function AdminPage() {
    const { user } = useUser();
    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    return (
        <AuthGate>
            {isAdmin ? <AdminDashboard /> : <NotAuthorized />}
        </AuthGate>
    )
}

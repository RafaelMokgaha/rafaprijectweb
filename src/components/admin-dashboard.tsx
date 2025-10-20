
'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import { AlertTriangle, Gamepad2, LogIn, Users } from 'lucide-react';

interface GameRequest {
    id: string;
    gameName: string;
    name: string;
    status: string;
    requestDate: any;
}

interface User {
    id: string;
    name: string;
    email: string;
    creationDate: any;
}

interface LoginEvent {
    id: string;
    displayName: string;
    email: string;
    timestamp: any;
}

const formatDate = (timestamp: any, relative = false) => {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate();
      return relative ? `${formatDistanceToNow(date)} ago` : format(date, 'PPP p');
    }
    return 'Date not available';
};

const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'secondary';
      case 'solved': return 'default';
      default: return 'outline';
    }
};

function AnalyticsCards({ users, requests, logins }: { users: User[] | null, requests: GameRequest[] | null, logins: LoginEvent[] | null }) {
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users?.length ?? 0}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{requests?.length ?? 0}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{logins?.length ?? 0}</div>
                </CardContent>
            </Card>
        </div>
    );
}

function GameRequestsTable({ requests, isLoading, error }: { requests: GameRequest[] | null, isLoading: boolean, error: Error | null }) {
    return (
        <SectionWrapper>
            <SectionTitle>Game Requests</SectionTitle>
            {isLoading && <p className="text-center">Loading requests...</p>}
            {error && <p className="text-center text-destructive">Error: {error.message}</p>}
            <div className="overflow-x-auto rounded-lg border border-primary/20 bg-background/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Game Name</TableHead>
                            <TableHead>Requester</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests && requests.length > 0 ? (
                            requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.gameName}</TableCell>
                                    <TableCell>{req.name}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>
                                    <TableCell>{formatDate(req.requestDate)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4} className="text-center">No game requests yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </SectionWrapper>
    );
}

function UsersTable({ users, isLoading, error }: { users: User[] | null, isLoading: boolean, error: Error | null }) {
    return (
        <SectionWrapper>
            <SectionTitle>All Users</SectionTitle>
            {isLoading && <p className="text-center">Loading users...</p>}
            {error && <p className="text-center text-destructive">Error: {error.message}</p>}
            <div className="overflow-x-auto rounded-lg border border-primary/20 bg-background/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{formatDate(user.creationDate)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={3} className="text-center">No users found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </SectionWrapper>
    );
}

function LoginHistoryTable({ logins, isLoading, error }: { logins: LoginEvent[] | null, isLoading: boolean, error: Error | null }) {
    return (
        <SectionWrapper>
            <SectionTitle>Recent Logins</SectionTitle>
            {isLoading && <p className="text-center">Loading login history...</p>}
            {error && <p className="text-center text-destructive">Error: {error.message}</p>}
            <div className="overflow-x-auto rounded-lg border border-primary/20 bg-background/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logins && logins.length > 0 ? (
                            logins.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.displayName || 'N/A'}</TableCell>
                                    <TableCell>{event.email}</TableCell>
                                    <TableCell>{formatDate(event.timestamp, true)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={3} className="text-center">No login events yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </SectionWrapper>
    );
}

export function AdminDashboard() {
  const firestore = useFirestore();

  const requestsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'game_requests'), orderBy('requestDate', 'desc')) : null, [firestore]);
  const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users'), orderBy('creationDate', 'desc')) : null, [firestore]);
  const loginsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'login_events'), orderBy('timestamp', 'desc')) : null, [firestore]);

  const { data: gameRequests, isLoading: loadingRequests, error: requestsError } = useCollection<GameRequest>(requestsQuery);
  const { data: users, isLoading: loadingUsers, error: usersError } = useCollection<User>(usersQuery);
  const { data: loginEvents, isLoading: loadingLogins, error: loginsError } = useCollection<LoginEvent>(loginsQuery);
  
  return (
    <>
        <AnalyticsCards users={users} requests={gameRequests} logins={loginEvents} />
        <GameRequestsTable requests={gameRequests} isLoading={loadingRequests} error={requestsError} />
        <UsersTable users={users} isLoading={loadingUsers} error={usersError} />
        <LoginHistoryTable logins={loginEvents} isLoading={loadingLogins} error={loginsError} />
    </>
  );
}

export function NotAuthorized() {
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

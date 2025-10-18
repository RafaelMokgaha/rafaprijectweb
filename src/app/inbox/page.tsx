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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { Paperclip } from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  body: string;
  sentAt: any;
  isRead: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
}

function Inbox() {
  const firestore = useFirestore();
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/messages`), orderBy('sentAt', 'desc'));
  }, [firestore, user]);

  const { data: messages, isLoading, error } = useCollection<Message>(messagesQuery);

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

  return (
    <>
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
          <SectionTitle>Your Inbox</SectionTitle>
          {isLoading && <p className="text-center">Loading messages...</p>}
          {error && <p className="text-center text-destructive">Error: {error.message}</p>}
          {messages && !isLoading && (
            <div className="max-w-4xl mx-auto">
                {messages.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {messages.map(msg => (
                            <AccordionItem value={msg.id} key={msg.id} className="bg-card/50 backdrop-blur-sm border-primary/20 rounded-lg mb-4 px-4">
                                <AccordionTrigger>
                                    <div className="flex justify-between items-center w-full">
                                        <div className='flex items-center gap-4'>
                                            {!msg.isRead && <Badge>New</Badge>}
                                            <span className='font-bold'>{msg.subject}</span>
                                        </div>
                                        <span className='text-sm text-muted-foreground'>{formatDate(msg.sentAt)}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-background/50 rounded-b-lg">
                                    <p className="whitespace-pre-wrap">{msg.body}</p>
                                    {msg.attachmentUrl && (
                                        <div className="mt-4">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                                    <Paperclip className="mr-2 h-4 w-4" />
                                                    {msg.attachmentName || 'Download Attachment'}
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-center text-muted-foreground">You have no messages.</p>
                )}
            </div>
          )}
        </SectionWrapper>
      </main>
    </>
  );
}


export default function InboxPage() {
    return (
        <AuthGate>
            <Inbox />
        </AuthGate>
    )
}

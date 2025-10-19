
'use client';

import React, { useRef, useState } from 'react';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { AnnouncementSection } from '@/components/announcement-section';
import { AvailableGames } from '@/components/available-games';
import { TutorialSection } from '@/components/tutorial-section';
import { InstructionsSection } from '@/components/instructions-section';
import { DiscordSection } from '@/components/discord-section';
import { Footer } from '@/components/footer';
import { RequestGameDialog } from '@/components/request-game-dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { AppDownloader } from './app-downloader';

const ADMIN_EMAIL = 'rafaproject06@gmail.com';

interface Message {
  id: string;
  isRead: boolean;
}

export function MainContent() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const availableGamesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const unreadMessagesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/messages`),
      where('isRead', '==', false)
    );
  }, [firestore, user]);

  const { data: unreadMessages } = useCollection<Message>(unreadMessagesQuery);
  const unreadCount = unreadMessages?.length || 0;

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  const handleScrollToGames = () => {
    availableGamesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openRequestFlow = (gameName = '') => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to request a game.',
        variant: 'destructive'
      });
      return;
    }
    setSelectedGame(gameName);
    setIsRequestDialogOpen(true);
  };

  const handleRequestSuccess = () => {
    setIsRequestDialogOpen(false);
    // The toast is now handled inside the RequestGameDialog
  };

  return (
    <>
      <RequestGameDialog
        isOpen={isRequestDialogOpen}
        setIsOpen={setIsRequestDialogOpen}
        gameName={selectedGame}
        onSuccess={handleRequestSuccess}
      />
      <Header>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-foreground">Welcome, {user.displayName || user.email}</span>
             <Button variant="outline" size="sm" asChild>
                <Link href="/generator">Generator</Link>
            </Button>
            <div className="relative">
               <Button variant="outline" size="sm" asChild>
                  <Link href="/inbox">Inbox</Link>
              </Button>
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {unreadCount}
                </div>
              )}
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">Admin</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </Header>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4">
          <HeroSection onRequestClick={() => openRequestFlow()} onAvailableClick={handleScrollToGames} />
          <AnnouncementSection />
          <div ref={availableGamesRef} className="scroll-mt-24">
             <AvailableGames onRequestClick={openRequestFlow} />
          </div>
          <TutorialSection />
          <InstructionsSection />
          <AppDownloader />
          <DiscordSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

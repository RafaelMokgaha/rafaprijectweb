
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
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from './ui/button';
import Link from 'next/link';

const ADMIN_EMAIL = 'rafaproject06@gmail.com';

export function MainContent() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const availableGamesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

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
                <Link href="/inbox">Inbox</Link>
            </Button>
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
          <DiscordSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

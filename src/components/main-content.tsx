'use client';

import React, { useRef, useState } from 'react';
import type { User } from '@/lib/types';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { AnnouncementSection } from '@/components/announcement-section';
import { AvailableGames } from '@/components/available-games';
import { TutorialSection } from '@/components/tutorial-section';
import { InstructionsSection } from '@/components/instructions-section';
import { DiscordSection } from '@/components/discord-section';
import { Footer } from '@/components/footer';
import { RequestGameDialog } from '@/components/request-game-dialog';

export function MainContent({ user }: { user: User }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const availableGamesRef = useRef<HTMLDivElement>(null);

  const handleScrollToGames = () => {
    availableGamesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openRequestDialog = (gameName = '') => {
    setSelectedGame(gameName);
    setIsDialogOpen(true);
  };

  return (
    <>
      <RequestGameDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        user={user}
        gameName={selectedGame}
      />
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4">
          <HeroSection onRequestClick={() => openRequestDialog()} onAvailableClick={handleScrollToGames} />
          <AnnouncementSection />
          <div ref={availableGamesRef} className="scroll-mt-24">
             <AvailableGames onRequestClick={openRequestDialog} />
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

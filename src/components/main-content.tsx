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
import { PaymentConfirmationDialog } from '@/components/payment-confirmation-dialog';
import { PaymentFormDialog } from '@/components/payment-form-dialog';
import { useToast } from '@/hooks/use-toast';

export function MainContent() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const availableGamesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  const handleScrollToGames = () => {
    availableGamesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openRequestFlow = (gameName = '') => {
    setSelectedGame(gameName);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentConfirm = () => {
    setIsPaymentDialogOpen(false);
    setIsRequestDialogOpen(true);
  };

  const handleRequestSuccess = () => {
    setIsRequestDialogOpen(false);
    setIsPaymentFormOpen(true);
  };

  const handlePaymentComplete = () => {
    setIsPaymentFormOpen(false);
    toast({
      title: "Payment Successful!",
      description: "Your request has been received and payment is confirmed.",
    });
  }

  return (
    <>
      <PaymentConfirmationDialog
        isOpen={isPaymentDialogOpen}
        onCancel={() => setIsPaymentDialogOpen(false)}
        onConfirm={handlePaymentConfirm}
      />
      <RequestGameDialog
        isOpen={isRequestDialogOpen}
        setIsOpen={setIsRequestDialogOpen}
        gameName={selectedGame}
        onSuccess={handleRequestSuccess}
      />
      <PaymentFormDialog
        isOpen={isPaymentFormOpen}
        onClose={handlePaymentComplete}
      />
      <Header />
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

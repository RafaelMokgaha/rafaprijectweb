import { Button } from '@/components/ui/button';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import Link from 'next/link';

export function InstructionsSection() {
  return (
    <SectionWrapper>
      <SectionTitle>Instructions</SectionTitle>
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-lg text-primary-foreground/80 mb-8">
          Download SteamTools to get started with fixes and other utilities for your games.
        </p>
        <Button size="lg" asChild className="font-bold tracking-wider uppercase text-lg shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 hover:scale-105">
          <Link href="https://gofile.io/d/RTQhXE" target="_blank" rel="noopener noreferrer">
            Download SteamTools
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}

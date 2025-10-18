import { Button } from '@/components/ui/button';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import Link from 'next/link';

export function DiscordSection() {
  return (
    <SectionWrapper>
      <SectionTitle>Join My Discord</SectionTitle>
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-lg text-primary-foreground/80 mb-8">
          Join the official Rafa Project server for support, announcements, and community chat.
        </p>
        <Button size="lg" asChild className="font-bold tracking-wider uppercase text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/50 hover:scale-105">
          <Link href="https://online-fix.me/" target="_blank" rel="noopener noreferrer">
            Join Now
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}

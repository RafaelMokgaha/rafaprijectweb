
import { Button } from '@/components/ui/button';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import Link from 'next/link';

export function DiscordSection() {
  return (
    <SectionWrapper>
      <SectionTitle>Join The Community</SectionTitle>
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-lg text-primary-foreground/80 mb-8">
          Join the official Rafa Project server for support, announcements, and community chat. Open a ticket for game requests or other issues.
        </p>
        <Button size="lg" asChild className="font-bold tracking-wider uppercase text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/50 hover:scale-105">
          <Link href="https://discord.gg/your-invite-code" target="_blank" rel="noopener noreferrer">
            Join Our Discord
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}

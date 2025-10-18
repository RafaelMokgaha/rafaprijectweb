import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onRequestClick: () => void;
  onAvailableClick: () => void;
}

export function HeroSection({ onRequestClick, onAvailableClick }: HeroSectionProps) {
  return (
    <section className="text-center py-20 md:py-32">
      <h1 className="font-headline text-5xl md:text-7xl font-bold uppercase text-shadow-glow">
        Welcome to RAFA Project
      </h1>
      <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
        What fix or game request do you need?
      </p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button 
          size="lg" 
          onClick={onRequestClick}
          className="w-full sm:w-auto font-bold tracking-wider uppercase text-lg shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 hover:scale-105"
        >
          Request Game
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={onAvailableClick}
          className="w-full sm:w-auto font-bold tracking-wider uppercase text-lg bg-transparent border-2 border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent shadow-lg shadow-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/50 hover:scale-105"
        >
          Available Games
        </Button>
      </div>
    </section>
  );
}

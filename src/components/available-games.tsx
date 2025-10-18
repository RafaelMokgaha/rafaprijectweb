import { availableGames } from '@/lib/data';
import { GameCard } from '@/components/game-card';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';

interface AvailableGamesProps {
  onRequestClick: (gameName: string) => void;
}

export function AvailableGames({ onRequestClick }: AvailableGamesProps) {
  return (
    <SectionWrapper>
      <SectionTitle>Available Games</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {availableGames.map((game) => (
          <GameCard 
            key={game.title} 
            game={game} 
            onRequestClick={() => onRequestClick(game.title)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

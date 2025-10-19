
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { GameCard } from '@/components/game-card';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import { collection, query, orderBy } from 'firebase/firestore';

interface AvailableGame {
  id: string;
  name: string;
  imageUrl: string;
}

interface AvailableGamesProps {
  onRequestClick: (gameName: string) => void;
}

export function AvailableGames({ onRequestClick }: AvailableGamesProps) {
  const firestore = useFirestore();

  const availableGamesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'available_games'), orderBy('name'));
  }, [firestore]);

  const { data: availableGames, isLoading, error } = useCollection<AvailableGame>(availableGamesQuery);

  return (
    <SectionWrapper>
      <SectionTitle>Available Games</SectionTitle>
      {isLoading && <p className="text-center">Loading games...</p>}
      {error && <p className="text-center text-destructive">Could not load games. Please try again later.</p>}
      {availableGames && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {availableGames.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onRequestClick={() => onRequestClick(game.name)}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

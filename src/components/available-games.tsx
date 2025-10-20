
'use client';

import { useMemo } from 'react';
import { GameCard } from '@/components/game-card';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import { availableGames } from '@/lib/data';
import type { Game } from '@/lib/types';
import { placeHolderImages } from '@/lib/placeholder-images';

interface AvailableGamesProps {
  onRequestClick: (gameName: string) => void;
}

export function AvailableGames({ onRequestClick }: AvailableGamesProps) {

  const categorizedGames = useMemo(() => {
    return availableGames.reduce((acc, game) => {
      if (!acc[game.category]) {
        acc[game.category] = [];
      }
      acc[game.category].push(game);
      return acc;
    }, {} as Record<string, Game[]>);
  }, []);

  return (
    <SectionWrapper>
      <SectionTitle>Available Games</SectionTitle>
        {Object.entries(categorizedGames).map(([category, games]) => (
            <div key={category} className="mb-12">
                <h3 className="text-2xl md:text-3xl font-headline font-semibold mb-6 text-primary-foreground/90 border-b-2 border-primary/30 pb-2">
                    {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {games.map((game) => {
                        const image = placeHolderImages.find(p => p.id === game.imageId);
                        const gameData = {
                            id: game.imageId,
                            name: game.title,
                            imageUrl: image?.imageUrl || 'https://placehold.co/600x800',
                            imageHint: image?.imageHint
                        }
                        return (
                            <GameCard 
                              key={game.title} 
                              game={gameData} 
                              onRequestClick={() => onRequestClick(game.title)}
                            />
                        )
                    })}
                </div>
            </div>
        ))}
    </SectionWrapper>
  );
}

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { placeHolderImages } from '@/lib/placeholder-images';
import type { Game } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
  onRequestClick: () => void;
}

export function GameCard({ game, onRequestClick }: GameCardProps) {
  const image = placeHolderImages.find(p => p.id === game.imageId);

  return (
    <div className="group relative rounded-lg overflow-hidden border border-primary/20 bg-background/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50">
      <div className="relative w-full aspect-[3/4]">
        {image && (
          <Image
            src={image.imageUrl}
            alt={game.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint={image.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-headline text-xl font-bold truncate">{game.title}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
            {game.platforms.map(platform => (
                <Badge key={platform} variant="secondary" className="bg-accent/50 text-accent-foreground/80 text-xs">{platform}</Badge>
            ))}
        </div>
        <Button 
          size="sm"
          onClick={onRequestClick}
          className="w-full mt-4 font-bold tracking-wide uppercase bg-primary/80 text-primary-foreground transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        >
          Request
        </Button>
      </div>
    </div>
  );
}

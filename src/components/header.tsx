import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const logo = placeHolderImages.find(p => p.id === 'logo');

  return (
    <header className="sticky top-0 z-40 py-4 backdrop-blur-sm bg-background/50 border-b border-primary/10">
      <div className="container mx-auto flex justify-center items-center">
        {logo && (
          <Image 
            src={logo.imageUrl}
            alt="RAFA PROJECT Logo"
            width={180}
            height={90}
            priority
            className="h-auto"
            data-ai-hint={logo.imageHint}
          />
        )}
      </div>
    </header>
  );
}

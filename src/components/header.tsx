import Image from 'next/image';
import Link from 'next/link';
import { placeHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const logoImage = placeHolderImages.find(p => p.id === 'logo');

  return (
    <header className="sticky top-0 z-40 py-2 backdrop-blur-sm bg-background/50 border-b border-primary/10">
      <div className="container mx-auto flex justify-start items-center h-14">
        {logoImage && (
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoImage.imageUrl}
              alt={logoImage.description}
              width={160}
              height={40}
              className="object-contain"
              data-ai-hint={logoImage.imageHint}
            />
          </Link>
        )}
      </div>
    </header>
  );
}

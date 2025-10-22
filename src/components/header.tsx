import Image from 'next/image';
import Link from 'next/link';
import { placeHolderImages } from '@/lib/placeholder-images';

export function Header({ children }: { children?: React.ReactNode }) {
  const logoImage = placeHolderImages.find(p => p.id === 'logo');

  return (
    <header className="sticky top-0 z-40 py-2 backdrop-blur-sm bg-background/50 border-b border-primary/10">
      <div className="container mx-auto flex justify-between items-center h-14">
        <div className="flex items-center">
            {logoImage && (
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={logoImage.imageUrl}
                        alt={logoImage.description}
                        width={200}
                        height={40}
                        className="object-contain h-10 w-auto"
                        data-ai-hint={logoImage.imageHint}
                        priority
                    />
                </Link>
            )}
        </div>
        <div>{children}</div>
      </div>
    </header>
  );
}

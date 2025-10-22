import Image from 'next/image';
import Link from 'next/link';
import { placeHolderImages } from '@/lib/placeholder-images';

export function Header({ children }: { children?: React.ReactNode }) {

  return (
    <header className="sticky top-0 z-40 py-2 backdrop-blur-sm bg-background/50 border-b border-primary/10">
      <div className="container mx-auto flex justify-between items-center h-14">
        <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
                <h1 className="text-2xl font-headline font-bold text-shadow-glow">TYLOCK GAMES</h1>
            </Link>
        </div>
        <div>{children}</div>
      </div>
    </header>
  );
}

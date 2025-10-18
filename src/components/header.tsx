import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 py-2 backdrop-blur-sm bg-background/50 border-b border-primary/10">
      <div className="container mx-auto flex justify-start items-center h-14">
        {/* Logo removed as requested */}
      </div>
    </header>
  );
}

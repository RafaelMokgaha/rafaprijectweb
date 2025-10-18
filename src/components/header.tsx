import Link from 'next/link';

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 py-2 backdrop-blur-sm bg-background/50 border-b border-primary/10">
      <div className="container mx-auto flex justify-between items-center h-14">
        <div>{/* Logo can go here if needed in the future */}</div>
        <div>{children}</div>
      </div>
    </header>
  );
}

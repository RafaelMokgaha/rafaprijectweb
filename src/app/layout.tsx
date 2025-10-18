import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { placeHolderImages } from '@/lib/placeholder-images';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'RAFA Project Launcher',
  description: 'Request new games and view available ones.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bgImage = placeHolderImages.find(p => p.id === 'background');

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {bgImage && (
            <div 
              className="fixed inset-0 z-[-2] bg-cover bg-center" 
              style={{ backgroundImage: `url(${bgImage.imageUrl})` }}
              data-ai-hint={bgImage.imageHint}
            />
          )}
          <div className="fixed inset-0 z-[-1] bg-background/70 backdrop-blur-sm" />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

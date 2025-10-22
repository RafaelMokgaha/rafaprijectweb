
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { placeHolderImages } from '@/lib/placeholder-images';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const backgroundImage = placeHolderImages.find(p => p.id === 'background');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>TYLOCK GAMES</title>
        <meta name="description" content="TYLOCK GAMES" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <FirebaseClientProvider>
          <div className="relative min-h-screen w-full">
            <div 
              className="absolute inset-0 bg-no-repeat bg-center"
              style={{ 
                backgroundImage: `url(${backgroundImage?.imageUrl})`,
                backgroundSize: '100% 100%',
                zIndex: -2 
              }}
              data-ai-hint={backgroundImage?.imageHint}
            />
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              style={{ zIndex: -1 }}
            />
            {children}
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

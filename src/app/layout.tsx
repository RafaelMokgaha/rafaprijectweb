
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>RAFA Project</title>
        <meta name="description" content="RAFA Project Launcher" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <FirebaseClientProvider>
          <div className="relative min-h-screen w-full">
            <div 
              className="absolute inset-0 bg-no-repeat bg-cover bg-center animate-ken-burns"
              style={{ 
                backgroundImage: "url('https://picsum.photos/seed/background/1920/1080')",
                zIndex: -2 
              }}
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

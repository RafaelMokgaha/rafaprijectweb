
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

export function AppDownloader() {
  const [appId, setAppId] = useState('');
  const { toast } = useToast();

  const handleDownload = () => {
    if (!appId.trim()) {
      toast({
        title: 'App ID Required',
        description: 'Please enter an App ID to start the download.',
        variant: 'destructive',
      });
      return;
    }

    // In a real application, you would trigger a file download here.
    // Since I cannot implement the backend for this, I will show a notification
    // to confirm the button is working.
    
    toast({
      title: 'Download Triggered (Placeholder)',
      description: `In a real app, a download for App ID: ${appId} would start now.`,
    });
    
    // IMPORTANT: When you have a backend, you can replace the toast above
    // with your download logic. For example:
    // const downloadUrl = `https://your-backend-service.com/download?appId=${appId}`;
    // window.location.href = downloadUrl;

    setAppId('');
  };

  return (
    <SectionWrapper>
      <SectionTitle>App Downloader</SectionTitle>
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-lg text-primary-foreground/80 mb-8">
          Enter the App ID provided to you to download the required files.
        </p>
        <div className="flex w-full max-w-sm mx-auto items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter App ID"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            className="text-base"
          />
          <Button 
            type="button" 
            onClick={handleDownload}
            className="font-bold tracking-wider uppercase"
          >
            <Download className="mr-2 h-5 w-5" />
            Download
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

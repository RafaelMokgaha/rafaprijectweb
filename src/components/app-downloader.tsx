
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

    // IMPORTANT: Replace this with your actual download URL structure.
    // For example, if your files are hosted at 'https://my-files.com/download?id=',
    // the URL would be `https://my-files.com/download?id=${appId}`
    const downloadUrl = `/api/download-placeholder?appId=${appId}`;

    // This creates a temporary link to trigger the browser's download prompt.
    const link = document.createElement('a');
    link.href = downloadUrl;
    // You can optionally suggest a filename here.
    // link.download = `app-${appId}.zip`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download Started',
      description: `Downloading files for App ID: ${appId}`,
    });

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


'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

    // IMPORTANT: Replace this with your actual base download URL.
    // For example: 'https://storage.googleapis.com/your-bucket/'.
    const baseUrl = 'https://www.cysaw.org/api/download?appId=';
    
    // This will create a final URL like 'https://your-url.com/12345'
    const downloadUrl = `${baseUrl}${appId}`;

    // This triggers the browser to navigate to the URL, which should
    // initiate a download if the server is configured correctly.
    window.location.href = downloadUrl;

    toast({
      title: 'Download Starting...',
      description: `Your download for App ID: ${appId} should begin shortly.`,
    });
  };

  return (
    <SectionWrapper>
      <SectionTitle>App Downloader</SectionTitle>
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-lg text-primary-foreground/80 mb-8">
          Enter the App ID provided to you to download the required files.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Enter App ID"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            className="text-center text-lg h-12 flex-grow"
          />
          <Button
            size="lg"
            onClick={handleDownload}
            className="w-full sm:w-auto font-bold tracking-wider uppercase text-lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Download
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}


import { Button } from '@/components/ui/button';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import Link from 'next/link';

export function InstructionsSection() {
  return (
    <SectionWrapper>
      <SectionTitle>Instructions</SectionTitle>
      <div className="max-w-3xl mx-auto text-left space-y-8">
        <h3 className="text-3xl font-headline font-bold text-center text-primary-foreground">
          🎮 How to Get the Game
        </h3>
        <p className="text-center text-muted-foreground text-lg">
          Follow the steps below carefully to get your game after requesting it.
        </p>
        
        <div className="space-y-6 rounded-lg p-6 bg-black/30 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">1</div>
            <div>
              <h4 className="font-bold text-xl text-primary-foreground">Download and Install</h4>
              <p className="text-primary-foreground/80 mt-1">
                Click the Download button below to get the necessary setup file. Once the download is complete, install it on your PC. Make sure the installation finishes successfully before moving to the next step.
              </p>
               <Button asChild className="mt-4">
                  <Link href="https://gofile.io/d/RTQhXE" target="_blank" rel="noopener noreferrer">
                    Download
                  </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">2</div>
            <div>
              <h4 className="font-bold text-xl text-primary-foreground">Request the Game</h4>
              <p className="text-primary-foreground/80 mt-1">
                After installing, request your game on this website.
              </p>
              <p className="text-destructive font-bold mt-2">
                ⚠️ Important: Do not request the game on Discord. You must request it here on the website first.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">3</div>
            <div>
              <h4 className="font-bold text-xl text-primary-foreground">Receive the Game</h4>
              <p className="text-primary-foreground/80 mt-1">
                After your request is confirmed, you’ll receive the game directly through Discord from the admin. Please make sure to check your tickets on the official RAFA Project Discord server.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">4</div>
            <div>
              <h4 className="font-bold text-xl text-primary-foreground">🎥 Follow the Installation Tutorial</h4>
              <p className="text-primary-foreground/80 mt-1">
                After downloading the game file, visit our website and watch the tutorial video located under the Tutorial section.
                The video will guide you step-by-step on how to install and set up the game properly to avoid any errors or missing files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

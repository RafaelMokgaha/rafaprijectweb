import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';
import { SectionWrapper } from '@/components/shared/section-layout';

export function AnnouncementSection() {
  const announcementImage = placeHolderImages.find(p => p.id === 'fc_26_announcement');

  if (!announcementImage) return null;

  return (
    <SectionWrapper className="!p-0 overflow-hidden border-2 border-primary/50 shadow-2xl shadow-primary/20">
      <div className="relative w-full aspect-[16/6]">
        <Image
          src={announcementImage.imageUrl}
          alt={announcementImage.description}
          fill
          className="object-cover"
          data-ai-hint={announcementImage.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center p-8 md:p-16">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-headline font-extrabold text-white uppercase text-shadow-glow">
            FC 20<br />COMING SOON
          </h2>
        </div>
      </div>
    </SectionWrapper>
  );
}

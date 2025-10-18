import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';

const publisherLogos = [
  { id: 'rockstar_logo', alt: 'Rockstar Games' },
  { id: 'ubisoft_logo', alt: 'Ubisoft' },
  { id: 'ea_logo', alt: 'EA' },
];

export function PublishersSection() {
  return (
    <SectionWrapper>
      <SectionTitle>Featured Publishers</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center justify-items-center">
        {publisherLogos.map((logo) => {
          const image = placeHolderImages.find((p) => p.id === logo.id);
          if (!image) return null;
          return (
            <div key={logo.id} className="relative h-24 w-48 transition-transform duration-300 hover:scale-110">
              <Image
                src={image.imageUrl}
                alt={logo.alt}
                fill
                className="object-contain"
                data-ai-hint={image.imageHint}
              />
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

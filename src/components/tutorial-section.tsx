import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';

export function TutorialSection() {
  const videoId = "W5tNrA-4xq4";

  return (
    <SectionWrapper>
      <SectionTitle>Tutorial Video</SectionTitle>
      <div className="relative overflow-hidden rounded-lg border-2 border-primary/30 shadow-lg shadow-primary/10" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </SectionWrapper>
  );
}

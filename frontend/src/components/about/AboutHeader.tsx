import PageHero from '@/components/shared/PageHero';
import type { AboutContent } from '@/content-schema/about';
import { resolveMediaUrl } from '@/lib/media';

type AboutHeaderProps = AboutContent['header'];

/** First sentence of a paragraph: the hero carries one line of who we are, not the full intro. */
export const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/s)?.[0] ?? text;

export default function AboutHeader({ title, paragraphs, image, imageAlt }: AboutHeaderProps) {
  const [lead] = paragraphs;

  return (
    <PageHero title={title} image={resolveMediaUrl(image)} imageAlt={imageAlt} headingId="about-title">
      {lead ? (
        <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-white/90 sm:text-xl">
          {firstSentence(lead)}
        </p>
      ) : null}
    </PageHero>
  );
}

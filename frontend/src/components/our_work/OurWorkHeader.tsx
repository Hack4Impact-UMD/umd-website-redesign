import PageHero from '@/components/shared/PageHero';
import type { OurWorkContent } from '@/content-schema/our-work';

type OurWorkHeaderProps = OurWorkContent['header'];

const OurWorkHeader = ({ title, subtitle, image, imageAlt }: OurWorkHeaderProps) => (
  <PageHero title={title} image={image} imageAlt={imageAlt} headingId="our-work-title">
    {subtitle ? (
      <p className="mt-6 font-body text-base leading-relaxed text-white/90 sm:text-lg">{subtitle}</p>
    ) : null}
  </PageHero>
);

export default OurWorkHeader;

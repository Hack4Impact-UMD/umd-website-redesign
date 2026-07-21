import { resolveContentDocument, type ResolvedContent } from '../contracts';
import { defaultHomeContent } from './defaults';
import { homeContentSchema, type HomeContent } from './types';

const hasNewsletterDestination = (content: HomeContent['newsletter']) =>
  Boolean(content.subscribeUrl || content.latestIssue?.href);

const sanitizePublishedContent = (content: HomeContent): HomeContent => {
  const verifiedTestimonials = content.testimonials.items.filter((item) => item.verified);
  const testimonialMode =
    content.testimonials.mode === 'published' && verifiedTestimonials.length === 0
      ? 'placeholder'
      : content.testimonials.mode;

  const verifiedStats = content.newsletter.stats.filter((stat) => stat.verified);
  const newsletterMode =
    content.newsletter.mode === 'externalLink' && !hasNewsletterDestination(content.newsletter)
      ? 'placeholder'
      : content.newsletter.mode;

  const visibleTiers = content.sponsors.tiers
    .map((tier) => ({
      ...tier,
      sponsors: tier.sponsors.filter((sponsor) => sponsor.visible),
    }))
    .filter((tier) => tier.sponsors.length > 0);
  const sponsorMode =
    content.sponsors.mode === 'published' && visibleTiers.length === 0
      ? 'placeholder'
      : content.sponsors.mode;

  return {
    ...content,
    testimonials: {
      ...content.testimonials,
      mode: testimonialMode,
      items: testimonialMode === 'published' ? verifiedTestimonials : [],
    },
    newsletter: {
      ...content.newsletter,
      mode: newsletterMode,
      stats: newsletterMode === 'externalLink' ? verifiedStats : [],
    },
    sponsors: {
      ...content.sponsors,
      mode: sponsorMode,
      tiers: sponsorMode === 'published' ? visibleTiers : [],
    },
  };
};

export const normalizeHomeContent = (document: unknown): ResolvedContent<HomeContent> => {
  const resolved = resolveContentDocument(document, homeContentSchema, defaultHomeContent);
  if (!resolved.content || resolved.source !== 'published') return resolved;
  return { ...resolved, content: sanitizePublishedContent(resolved.content) };
};

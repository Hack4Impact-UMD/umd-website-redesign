import { resolveContentDocument, type ResolvedContent } from '../contracts';
import { defaultHomeContent } from './defaults';
import { homeContentSchema, type HomeContent } from './types';

const hasNewsletterDestination = (content: HomeContent['newsletter']) =>
  Boolean(content.subscribeUrl || content.latestIssue?.href);

const addLegacyImpactFallback = (document: unknown): unknown => {
  if (!document || typeof document !== 'object') return document;
  const candidate = document as { payload?: unknown };
  if (!candidate.payload || typeof candidate.payload !== 'object' || 'impact' in candidate.payload) {
    return document;
  }

  return {
    ...candidate,
    payload: {
      ...candidate.payload,
      impact: defaultHomeContent.impact,
    },
  };
};

const sanitizePublishedContent = (content: HomeContent): HomeContent => {
  const verifiedImpactStats = content.impact.stats.filter((stat) => stat.verified);
  const impactMode =
    content.impact.mode === 'published' && verifiedImpactStats.length === 0
      ? 'placeholder'
      : content.impact.mode;
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
    impact: {
      ...content.impact,
      mode: impactMode,
      stats: impactMode === 'published' ? verifiedImpactStats : [],
    },
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
  const resolved = resolveContentDocument(
    addLegacyImpactFallback(document),
    homeContentSchema,
    defaultHomeContent,
  );
  if (!resolved.content || resolved.source !== 'published') return resolved;
  return { ...resolved, content: sanitizePublishedContent(resolved.content) };
};

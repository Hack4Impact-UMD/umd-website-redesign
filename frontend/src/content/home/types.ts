import { z } from 'zod';
import { ctaSchema, safeHttpsSchema, safeMediaSchema, testimonialSchema } from '../shared';

const sectionModeSchema = z.enum(['published', 'placeholder', 'hidden']);

const verifiedTestimonialSchema = testimonialSchema.extend({
  verified: z.boolean(),
});

const verifiedStatSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  verified: z.boolean(),
});

const sponsorSchema = z.object({
  name: z.string().trim().min(1),
  logo: safeMediaSchema,
  href: safeHttpsSchema.optional(),
  visible: z.boolean(),
});

export const homeContentSchema = z.object({
  hero: z.object({
    heading: z.string().trim().min(1),
    body: z.string().trim().min(1),
    slides: z.array(z.object({ image: safeMediaSchema, alt: z.string().trim().min(1) })).min(1),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
  }),
  nonprofitMap: z.object({
    mode: z.enum(['placeholder', 'hidden']),
    heading: z.string().trim().min(1),
    body: z.string().trim().min(1),
    statusTitle: z.string().trim().min(1),
    statusDescription: z.string().trim().min(1),
    featuredProject: z
      .object({
        title: z.string().trim().min(1),
        summary: z.string().trim().min(1),
        href: ctaSchema.shape.href,
        logo: safeMediaSchema.optional(),
        logoAlt: z.string().trim().min(1).optional(),
      })
      .optional(),
  }),
  testimonials: z.object({
    mode: sectionModeSchema,
    heading: z.string().trim().min(1),
    placeholderMessage: z.string().trim().min(1),
    items: z.array(verifiedTestimonialSchema),
  }),
  newsletter: z.object({
    mode: z.enum(['externalLink', 'placeholder', 'hidden']),
    heading: z.string().trim().min(1),
    body: z.string().trim().min(1),
    subscribeHeading: z.string().trim().min(1),
    linkLabel: z.string().trim().min(1).optional(),
    subscribeUrl: safeHttpsSchema.optional(),
    placeholderMessage: z.string().trim().min(1),
    latestIssue: z
      .object({
        dateLabel: z.string().trim().min(1).optional(),
        sender: z.string().trim().min(1),
        title: z.string().trim().min(1),
        summary: z.string().trim().min(1),
        href: safeHttpsSchema.optional(),
      })
      .optional(),
    stats: z.array(verifiedStatSchema),
  }),
  sponsors: z.object({
    mode: sectionModeSchema,
    heading: z.string().trim().min(1),
    placeholderMessage: z.string().trim().min(1),
    tiers: z.array(
      z.object({
        name: z.string().trim().min(1),
        sponsors: z.array(sponsorSchema),
      }),
    ),
  }),
  cta: z.object({
    heading: z.string().trim().min(1),
    primary: ctaSchema,
    secondary: ctaSchema,
  }),
});

export type HomeContent = z.infer<typeof homeContentSchema>;

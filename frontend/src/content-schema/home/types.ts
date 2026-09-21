import { z } from 'zod';
import { ctaSchema, safeHttpsSchema, safeMediaSchema, testimonialSchema } from '../shared';

const sectionModeSchema = z.enum(['published', 'placeholder', 'hidden']);

/**
 * The publication gate (section `mode`) and the editorial trust flags
 * (`verified`, `visible`) were added after the current Firestore content was
 * written, so live documents predate every one of these keys. Requiring them
 * outright rejected the whole payload, which sent the page back to the local
 * default and made CMS edits invisible.
 *
 * Absent therefore means "this document is older than the gate", which is the
 * only case a default can apply to: FireCMS requires each of these fields
 * explicitly (see `validateContentPayload`), so anything saved by an editor
 * always carries its own value and never reaches these defaults.
 */
const verifiedTestimonialSchema = testimonialSchema.extend({
  verified: z.boolean().default(true),
});

const verifiedStatSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  verified: z.boolean().default(true),
});

const impactSectionSchema = z.object({
  mode: sectionModeSchema.default('published'),
  heading: z.string().trim().min(1),
  placeholderMessage: z.string().trim().min(1).default('Impact metrics are being updated.'),
  stats: z.array(verifiedStatSchema),
});

const sponsorSchema = z.object({
  name: z.string().trim().min(1),
  logo: safeMediaSchema,
  href: safeHttpsSchema.optional(),
  visible: z.boolean().default(true),
});

const latestIssueSchema = z.object({
  dateLabel: z.string().trim().min(1).optional(),
  sender: z.string().trim().min(1),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  href: safeHttpsSchema.optional(),
});

export const homeContentSchema = z.object({
  hero: z.object({
    heading: z.string().trim().min(1),
    body: z.string().trim().min(1),
    slides: z
      .array(
        z.object({
          image: safeMediaSchema,
          mobileImage: safeMediaSchema.optional(),
          alt: z.string().trim().min(1),
        }),
      )
      .min(1),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
  }),
  impact: impactSectionSchema,
  nonprofitMap: z.object({
    mode: z.enum(['placeholder', 'hidden']).default('placeholder'),
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
    mode: sectionModeSchema.default('published'),
    heading: z.string().trim().min(1),
    placeholderMessage: z
      .string()
      .trim()
      .min(1)
      .default(
        'We’re gathering stories from our nonprofit partners. Check back soon to hear about their experiences working with our teams.',
      ),
    items: z.array(verifiedTestimonialSchema),
  }),
  newsletter: z.object({
    mode: z.enum(['externalLink', 'placeholder', 'hidden']).default('externalLink'),
    heading: z.string().trim().min(1),
    body: z.string().trim().min(1),
    subscribeHeading: z.string().trim().min(1),
    linkLabel: z.string().trim().min(1).optional(),
    subscribeUrl: safeHttpsSchema.optional(),
    placeholderMessage: z
      .string()
      .trim()
      .min(1)
      .default(
        'We’re preparing a public archive of chapter updates. In the meantime, follow our social channels for the latest news.',
      ),
    latestIssue: latestIssueSchema.optional(),
    stats: z.array(verifiedStatSchema),
  }),
  sponsors: z.object({
    mode: sectionModeSchema.default('published'),
    heading: z.string().trim().min(1),
    placeholderMessage: z
      .string()
      .trim()
      .min(1)
      .default('Sponsor information is being updated.'),
    tiers: z.array(
      z.object({
        name: z.string().trim().min(1),
        sponsors: z.array(sponsorSchema),
      }),
    ),
    contactCta: ctaSchema.optional(),
  }),
  cta: z.object({
    heading: z.string().trim().min(1),
    primary: ctaSchema,
    secondary: ctaSchema,
  }),
});

export type HomeContent = z.infer<typeof homeContentSchema>;

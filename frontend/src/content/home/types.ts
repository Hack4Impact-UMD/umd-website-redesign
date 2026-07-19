import { z } from 'zod';
import { ctaSchema, safeMediaSchema, testimonialSchema } from '../shared';

export const homeContentSchema = z.object({
  hero: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    slides: z.array(z.object({ image: safeMediaSchema, alt: z.string().min(1) })),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
  }),
  nonprofitMap: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    statusTitle: z.string().min(1),
    statusDescription: z.string().min(1),
  }),
  testimonials: z.object({ heading: z.string().min(1), items: z.array(testimonialSchema) }),
  newsletter: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    subscribeHeading: z.string().min(1),
    subscribeSuccessMessage: z.string().optional(),
    card: z.object({
      date: z.string(),
      sender: z.string(),
      title: z.string(),
      recapTitle: z.string(),
      recapBody: z.string(),
    }),
    stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })),
  }),
  sponsors: z.object({
    heading: z.string().min(1),
    tiers: z.array(
      z.object({
        name: z.string().min(1),
        sponsors: z.array(z.object({ name: z.string().min(1), logo: safeMediaSchema })),
      }),
    ),
  }),
  cta: z.object({ heading: z.string().min(1), primary: ctaSchema, secondary: ctaSchema }),
});

export type HomeContent = z.infer<typeof homeContentSchema>;

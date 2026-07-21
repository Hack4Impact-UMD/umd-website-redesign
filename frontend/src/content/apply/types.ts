import { z } from 'zod';
import { faqItemSchema, safeCtaSchema, safeHttpsSchema, safeMediaSchema, testimonialSchema, timelineStepSchema } from '../shared';

export const applicationStatusSchema = z.discriminatedUnion('state', [
  z.object({
    state: z.literal('open'),
    label: z.string().min(1),
    applicationUrl: safeHttpsSchema,
  }),
  z.object({
    state: z.literal('closed'),
    label: z.string().min(1),
    applicationUrl: safeCtaSchema.optional(),
  }),
  z.object({
    state: z.literal('comingSoon'),
    label: z.string().min(1),
    applicationUrl: safeCtaSchema.optional(),
  }),
]);

const introSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: safeCtaSchema,
  image: safeMediaSchema,
  imageAlt: z.string().min(1),
});

const timelineSchema = z.object({
  heading: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(timelineStepSchema),
});

const faqSchema = z.object({ heading: z.string().min(1), items: z.array(faqItemSchema) });
const finalCtaSchema = z.object({
  heading: z.string().min(1),
  primaryLabel: z.string().min(1),
  primaryHref: safeCtaSchema,
  secondaryLabel: z.string().min(1),
  secondaryHref: safeCtaSchema,
});

export const applyStudentContentSchema = z.object({
  applicationStatus: applicationStatusSchema,
  hero: z.object({ title: z.string().min(1), image: safeMediaSchema }),
  intro: introSchema,
  roles: z.array(
    z.object({ title: z.string().min(1), description: z.string().min(1), icon: z.string().min(1) }),
  ),
  timeline: timelineSchema,
  testimonials: z.array(testimonialSchema),
  faq: faqSchema,
  cta: finalCtaSchema,
});

export const applyNonprofitContentSchema = z.object({
  applicationStatus: applicationStatusSchema,
  hero: z.object({ title: z.string().min(1), image: safeMediaSchema }),
  banner: z.object({ enabled: z.boolean(), text: z.string() }).optional(),
  intro: introSchema,
  criteria: z.object({ heading: z.string().min(1), paragraphs: z.array(z.string().min(1)) }),
  timeline: timelineSchema,
  testimonials: z.array(testimonialSchema),
  faq: faqSchema,
  cta: finalCtaSchema,
});

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type ApplyStudentContent = z.infer<typeof applyStudentContentSchema>;
export type ApplyNonprofitContent = z.infer<typeof applyNonprofitContentSchema>;

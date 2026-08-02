import { z } from 'zod';
import { safeCtaSchema, safeMediaSchema } from '../shared';

export const aboutContentSchema = z.object({
  header: z.object({
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(1)),
    image: safeMediaSchema,
    imageAlt: z.string().min(1),
  }),
  mission: z.object({ heading: z.string().min(1), body: z.string().min(1) }),
  story: z.object({
    heading: z.string().min(1),
    intro: z.string().min(1),
    items: z.array(
      z.object({
        label: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        links: z.array(z.object({ label: z.string().min(1), href: safeCtaSchema })).optional(),
        image: safeMediaSchema.optional(),
        imageAlt: z.string().min(1).optional(),
      }),
    ),
  }).optional(),
  highlights: z.object({
    heading: z.string().min(1),
    items: z.array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    ).length(6),
  }).optional(),
  values: z.object({
    heading: z.string().min(1),
    items: z.array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: safeMediaSchema,
        imageAlt: z.string().min(1),
      }),
    ),
  }),
  currentProjects: z.object({
    heading: z.string().min(1),
    linkLabel: z.string().min(1),
    linkHref: safeCtaSchema,
    projectPaths: z.array(z.string().min(1)).default([]),
  }),
});

export type AboutContent = z.infer<typeof aboutContentSchema>;

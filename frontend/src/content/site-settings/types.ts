import { z } from 'zod';
import { safeCtaSchema, safeMediaSchema } from '../shared';

const linkSchema = z.object({ label: z.string().min(1), href: safeCtaSchema });

export const siteSettingsSchema = z.object({
  navbar: z.object({
    links: z.array(linkSchema.extend({ dropdown: z.array(linkSchema).optional() })),
  }),
  footer: z.object({
    newsletterPrompt: z.string(),
    newsletterUrl: safeCtaSchema.optional(),
    exploreLinks: z.array(linkSchema),
    applyLinks: z.array(linkSchema),
    socialLinks: z.array(linkSchema.extend({ icon: z.string().min(1) })),
    contact: z.object({ addressLines: z.array(z.string()), email: z.string().email() }),
  }),
  branding: z.object({ logo: safeMediaSchema }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

import { z } from 'zod';
import { safeCtaSchema, safeHttpsSchema, safeMediaSchema } from '../shared';

const nonEmptyTextSchema = z.string().trim().min(1);
const linkSchema = z.object({ label: nonEmptyTextSchema, href: safeCtaSchema });
const socialIconSchema = z.enum(['Instagram', 'Github', 'Linkedin', 'Facebook']);

export const siteSettingsSchema = z.object({
  navbar: z.object({
    links: z.array(linkSchema.extend({ dropdown: z.array(linkSchema).optional() })).min(1),
  }),
  footer: z.object({
    newsletterPrompt: nonEmptyTextSchema,
    newsletterUrl: safeHttpsSchema.optional(),
    exploreLinks: z.array(linkSchema),
    applyLinks: z.array(linkSchema),
    socialLinks: z.array(z.object({
      label: nonEmptyTextSchema,
      href: safeHttpsSchema,
      icon: socialIconSchema,
    })),
    contact: z.object({
      addressLines: z.array(nonEmptyTextSchema).min(1),
      email: z.string().trim().email(),
    }),
  }),
  branding: z.object({ logo: safeMediaSchema }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

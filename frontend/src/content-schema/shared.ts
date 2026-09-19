import { z } from 'zod';
import { resolveMediaUrl } from '@/lib/media';
import { isSafeCtaUrl, isSafeHttpsUrl } from '@/lib/urls';

export const safeMediaSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => Boolean(resolveMediaUrl(value)), 'Unsafe media URL');

export const safeCtaSchema = z
  .string()
  .trim()
  .min(1)
  .refine(isSafeCtaUrl, 'Unsafe link URL');

export const safeHttpsSchema = z
  .string()
  .trim()
  .min(1)
  .refine(isSafeHttpsUrl, 'Unsafe HTTPS URL');

export const ctaSchema = z.object({ label: z.string().trim().min(1), href: safeCtaSchema });

export const testimonialSchema = z.object({
  quote: z.string().trim().min(1),
  name: z.string().trim().min(1),
  organization: z.string().trim().min(1),
});

export const timelineStepSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export const faqItemSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

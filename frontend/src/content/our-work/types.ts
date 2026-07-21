import { z } from 'zod';
import { safeMediaSchema } from '../shared';

export const ourWorkContentSchema = z.object({
  header: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    image: safeMediaSchema,
    imageAlt: z.string().min(1),
  }),
});

export type OurWorkContent = z.infer<typeof ourWorkContentSchema>;

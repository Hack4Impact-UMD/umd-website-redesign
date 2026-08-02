import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);
const optionalString = z.string().nullish().transform((value) => value ?? undefined);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const omitNullTitleRoles = (value: unknown) => {
  if (!Array.isArray(value)) return value;

  return value.filter((role) => !(isRecord(role) && role.title === null));
};

export const paginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(250),
  pageCount: z.number().int().min(1),
  total: z.number().int().min(0),
});

const mediaEntitySchema = z.object({
  id: z.string(),
  attributes: z.object({ url: nonEmptyString }),
});

export const memberDisplayStatusSchema = z.enum([
  'Current Member',
  'Current Board Member',
  'Former Member or Board Member',
]);

export const memberAttributesSchema = z.object({
  firstName: nonEmptyString,
  lastName: nonEmptyString,
  pronouns: optionalString,
  linkedinUrl: optionalString,
  memberDisplayStatus: memberDisplayStatusSchema,
  componentRolesArr: z.preprocess(
    omitNullTitleRoles,
    z.array(
      z.object({
        title: nonEmptyString,
        isDisplayRole: z.boolean(),
        team: optionalString,
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
      }),
    ),
  ),
  avatar: z.object({ data: mediaEntitySchema.nullable() }),
});

export const memberEntitySchema = z.object({
  id: z.string(),
  attributes: memberAttributesSchema,
});

export const projectAttributesSchema = z.object({
  title: nonEmptyString,
  path: nonEmptyString,
  startDate: optionalString,
  summary: z.string(),
  blurb: z.string(),
  isFeatured: z.boolean(),
  isCurrentProject: z.boolean(),
  repoURL: optionalString,
  hostedProjectURL: optionalString,
  imageAltText: optionalString,
  nonprofit: z
    .object({
      data: z
        .object({
          id: z.string(),
          attributes: z.object({ name: nonEmptyString }),
        })
        .nullable(),
    })
    .optional(),
  image: z.object({ data: z.array(mediaEntitySchema) }),
  members: z.object({ data: z.array(memberEntitySchema) }),
});

export const projectEntitySchema = z.object({
  id: z.string(),
  attributes: projectAttributesSchema,
});

export const collectionSchema = <T extends z.ZodTypeAny>(attributes: T) =>
  z.object({
    data: z.array(z.object({ id: z.string(), attributes })),
    meta: z.object({ pagination: paginationSchema }),
  });

export const projectsResponseSchema = collectionSchema(projectAttributesSchema);
export const membersResponseSchema = collectionSchema(memberAttributesSchema);

export const contentResponseSchema = z.object({
  data: z.unknown().nullable(),
  meta: z.object({ collection: z.string(), documentId: z.string() }),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type MemberDisplayStatus = z.infer<typeof memberDisplayStatusSchema>;
export type MemberAttributes = z.infer<typeof memberAttributesSchema>;
export type MemberEntity = z.infer<typeof memberEntitySchema>;
export type ProjectAttributes = z.infer<typeof projectAttributesSchema>;
export type ProjectEntity = z.infer<typeof projectEntitySchema>;
export type ProjectsResponse = z.infer<typeof projectsResponseSchema>;
export type MembersResponse = z.infer<typeof membersResponseSchema>;

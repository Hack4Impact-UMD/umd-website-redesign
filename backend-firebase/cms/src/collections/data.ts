import { buildCollection, type StorageConfig } from '@firecms/core';
import { normalizeReferences, referencesToIds } from '../lib/relationAdapters';
import { membersPreview, projectsPreview } from '../lib/relationPreview';
import {
  assertRelationTargetsExist,
  syncMemberProjects,
  syncProjectMembers,
} from '../lib/relationSync';

const baseImageStorage: Omit<StorageConfig, 'storagePath'> = {
  acceptedFiles: ['image/*'],
  maxSize: 10 * 1024 * 1024,
  storeUrl: false,
  imageResize: {
    maxWidth: 2400,
    maxHeight: 2400,
    mode: 'contain',
    format: 'original',
    quality: 85,
  },
  fileName: '{propertyKey}-{rand}.{file.ext}',
};

const imageProperty = (name: string, storagePath: string) => ({
  dataType: 'string' as const,
  name,
  storage: { ...baseImageStorage, storagePath },
});

const mediaMapProperty = (storagePath: string, name = 'Media') => ({
  dataType: 'map' as const,
  name,
  properties: {
    url: imageProperty('Image', storagePath),
    alt: { dataType: 'string' as const, name: 'Alt text' },
    mimeType: { dataType: 'string' as const, name: 'MIME type' },
    width: { dataType: 'number' as const, name: 'Width' },
    height: { dataType: 'number' as const, name: 'Height' },
  },
});

const readValue = (values: unknown, key: string): unknown => {
  if (!values || typeof values !== 'object') return undefined;
  return (values as Record<string, unknown>)[key];
};

export const projectsCollection = buildCollection({
  id: 'projects',
  name: 'Projects',
  path: 'projects',
  permissions: { read: true, create: true, edit: true, delete: false },
  icon: 'work',
  titleProperty: 'title',
  customId: true,
  hideIdFromCollection: true,
  initialSort: ['title', 'asc'],
  propertiesOrder: [
    'title', 'path', 'startDate', 'summary', 'blurb', 'isFeatured',
    'isCurrentProject', 'repoURL', 'hostedProjectURL', 'imageAltText',
    'nonprofitName', 'memberIds', 'image',
  ],
  properties: {
    title: { dataType: 'string', name: 'Title', columnWidth: 240, validation: { required: true } },
    path: { dataType: 'string', name: 'Path', columnWidth: 180, validation: { required: true } },
    startDate: { dataType: 'date', name: 'Start date', columnWidth: 140 },
    summary: { dataType: 'string', name: 'Summary', hideFromCollection: true, validation: { required: true }, multiline: true },
    blurb: { dataType: 'string', name: 'Blurb', hideFromCollection: true, validation: { required: true }, markdown: true },
    isFeatured: { dataType: 'boolean', name: 'Featured', columnWidth: 112, validation: { required: true } },
    isCurrentProject: { dataType: 'boolean', name: 'Current project', columnWidth: 138, validation: { required: true } },
    repoURL: { dataType: 'string', name: 'Repository URL', hideFromCollection: true, url: true },
    hostedProjectURL: { dataType: 'string', name: 'Hosted URL', hideFromCollection: true, url: true },
    imageAltText: { dataType: 'string', name: 'Image alt text', hideFromCollection: true },
    nonprofitName: { dataType: 'string', name: 'Nonprofit name', columnWidth: 220 },
    memberIds: {
      dataType: 'array',
      name: 'Members',
      hideFromCollection: true,
      description: 'Search and select members by name.',
      Preview: membersPreview,
      of: {
        dataType: 'reference',
        name: 'Member',
        path: 'members',
        previewProperties: ['firstName', 'lastName', 'memberDisplayStatus'],
        includeId: false,
      },
    },
    image: { dataType: 'array', name: 'Project images', hideFromCollection: true, of: mediaMapProperty('projects/{entityId}') },
  },
  callbacks: {
    onFetch: async ({ entity }) => ({
      ...entity,
      values: {
        ...entity.values,
        memberIds: normalizeReferences(readValue(entity.values, 'memberIds'), 'members'),
      },
    }),
    onPreSave: async ({ values }) => {
      const memberIds = referencesToIds(readValue(values, 'memberIds'));
      await assertRelationTargetsExist({ collectionPath: 'members', targetIds: memberIds });
      return { ...values, memberIds };
    },
    onSaveSuccess: async ({ entityId, values, previousValues }) => {
      await syncProjectMembers({
        projectId: entityId,
        previousMemberIds: readValue(previousValues, 'memberIds'),
        nextMemberIds: readValue(values, 'memberIds'),
      });
    },
  },
});

export const membersCollection = buildCollection({
  id: 'members',
  name: 'Members',
  path: 'members',
  permissions: { read: true, create: true, edit: true, delete: false },
  icon: 'groups',
  titleProperty: 'lastName',
  customId: true,
  hideIdFromCollection: true,
  initialSort: ['lastName', 'asc'],
  propertiesOrder: [
    'firstName', 'lastName', 'memberDisplayStatus', 'projectIds',
    'componentRolesArr', 'avatar', 'linkedinUrl', 'pronouns',
  ],
  properties: {
    firstName: { dataType: 'string', name: 'First name', columnWidth: 160, validation: { required: true } },
    lastName: { dataType: 'string', name: 'Last name', columnWidth: 180, validation: { required: true } },
    pronouns: { dataType: 'string', name: 'Pronouns', hideFromCollection: true },
    memberDisplayStatus: {
      dataType: 'string',
      name: 'Member display status',
      enumValues: [
        { id: 'Current Member', label: 'Current Member' },
        { id: 'Current Board Member', label: 'Current Board Member' },
        { id: 'Former Member or Board Member', label: 'Former Member or Board Member' },
      ],
      columnWidth: 220,
      validation: { required: true },
    },
    avatar: { ...mediaMapProperty('members/{entityId}', 'Avatar'), hideFromCollection: true },
    linkedinUrl: { dataType: 'string', name: 'LinkedIn URL', hideFromCollection: true, url: true },
    projectIds: {
      dataType: 'array',
      name: 'Projects',
      hideFromCollection: true,
      description: 'Search and select projects by title.',
      Preview: projectsPreview,
      of: {
        dataType: 'reference',
        name: 'Project',
        path: 'projects',
        previewProperties: ['title', 'path', 'isCurrentProject'],
        includeId: false,
      },
    },
    componentRolesArr: {
      dataType: 'array',
      name: 'Roles',
      hideFromCollection: true,
      of: {
        dataType: 'map',
        name: 'Role',
        properties: {
          title: { dataType: 'string', name: 'Title', validation: { required: true } },
          isDisplayRole: { dataType: 'boolean', name: 'Display role', validation: { required: true } },
          team: { dataType: 'string', name: 'Team' },
          startDate: { dataType: 'date', name: 'Start date' },
          endDate: { dataType: 'date', name: 'End date' },
        },
      },
    },
  },
  callbacks: {
    onFetch: async ({ entity }) => ({
      ...entity,
      values: {
        ...entity.values,
        projectIds: normalizeReferences(readValue(entity.values, 'projectIds'), 'projects'),
      },
    }),
    onPreSave: async ({ values }) => {
      const projectIds = referencesToIds(readValue(values, 'projectIds'));
      await assertRelationTargetsExist({ collectionPath: 'projects', targetIds: projectIds });
      return { ...values, projectIds };
    },
    onSaveSuccess: async ({ entityId, values, previousValues }) => {
      await syncMemberProjects({
        memberId: entityId,
        previousProjectIds: readValue(previousValues, 'projectIds'),
        nextProjectIds: readValue(values, 'projectIds'),
      });
    },
  },
});

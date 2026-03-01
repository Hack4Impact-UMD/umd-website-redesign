import { buildCollection, StorageConfig } from '@firecms/core';
import { normalizeReferences, referencesToIds } from './lib/relationAdapters';
import { membersPreview, projectsPreview } from './lib/relationPreview';
import { syncMemberProjects, syncProjectMembers } from './lib/relationSync';

const TEN_MB = 10 * 1024 * 1024;

const baseImageStorage: Omit<StorageConfig, 'storagePath'> = {
  acceptedFiles: ['image/*'],
  maxSize: TEN_MB,
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
  storage: {
    ...baseImageStorage,
    storagePath,
  },
});

const mediaMapProperty = (storagePath: string, name = 'Media') => ({
  dataType: 'map' as const,
  name,
  properties: {
    url: imageProperty('Image', storagePath),
    alt: {
      dataType: 'string' as const,
      name: 'Alt text',
    },
    mimeType: {
      dataType: 'string' as const,
      name: 'MIME type',
    },
    width: {
      dataType: 'number' as const,
      name: 'Width',
    },
    height: {
      dataType: 'number' as const,
      name: 'Height',
    },
  },
});

const readValue = (values: unknown, key: string): unknown => {
  if (!values || typeof values !== 'object') {
    return undefined;
  }
  return (values as Record<string, unknown>)[key];
};

export const projectsCollection = buildCollection({
  id: 'projects',
  name: 'Projects',
  path: 'projects',
  icon: 'work',
  titleProperty: 'title',
  customId: true,
  hideIdFromCollection: true,
  hideIdFromForm: true,
  initialSort: ['title', 'asc'],
  propertiesOrder: [
    'title',
    'path',
    'startDate',
    'summary',
    'blurb',
    'isFeatured',
    'isCurrentProject',
    'repoURL',
    'hostedProjectURL',
    'imageAltText',
    'nonprofitName',
    'memberIds',
    'image',
  ],
  properties: {
    title: { dataType: 'string', name: 'Title', validation: { required: true } },
    path: { dataType: 'string', name: 'Path', validation: { required: true } },
    startDate: { dataType: 'date', name: 'Start date' },
    summary: { dataType: 'string', name: 'Summary', validation: { required: true }, multiline: true },
    blurb: { dataType: 'string', name: 'Blurb', validation: { required: true }, markdown: true },
    isFeatured: { dataType: 'boolean', name: 'Featured', validation: { required: true } },
    isCurrentProject: { dataType: 'boolean', name: 'Current project', validation: { required: true } },
    repoURL: { dataType: 'string', name: 'Repository URL', url: true },
    hostedProjectURL: { dataType: 'string', name: 'Hosted URL', url: true },
    imageAltText: { dataType: 'string', name: 'Image alt text' },
    nonprofitName: { dataType: 'string', name: 'Nonprofit name' },
    memberIds: {
      dataType: 'array',
      name: 'Members',
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
    image: {
      dataType: 'array',
      name: 'Project images',
      of: mediaMapProperty('projects/{entityId}'),
    },
  },
  callbacks: {
    onFetch: async ({ entity }) => ({
      ...entity,
      values: {
        ...entity.values,
        memberIds: normalizeReferences(readValue(entity.values, 'memberIds'), 'members'),
      },
    }),
    onPreSave: async ({ values }) => ({
      ...values,
      memberIds: referencesToIds(readValue(values, 'memberIds')),
    }),
    onSaveSuccess: async ({ context, entityId, values, previousValues }) => {
      await syncProjectMembers({
        context,
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
  icon: 'groups',
  titleProperty: 'lastName',
  customId: true,
  hideIdFromCollection: true,
  hideIdFromForm: true,
  initialSort: ['lastName', 'asc'],
  propertiesOrder: ['firstName', 'lastName', 'memberDisplayStatus', 'projectIds', 'componentRolesArr', 'avatar', 'linkedinUrl', 'pronouns'],
  properties: {
    firstName: { dataType: 'string', name: 'First name', validation: { required: true } },
    lastName: { dataType: 'string', name: 'Last name', validation: { required: true } },
    pronouns: { dataType: 'string', name: 'Pronouns' },
    memberDisplayStatus: {
      dataType: 'string',
      name: 'Member display status',
      enumValues: [
        { id: 'Current Member', label: 'Current Member' },
        { id: 'Current Board Member', label: 'Current Board Member' },
        { id: 'Former Member or Board Member', label: 'Former Member or Board Member' },
      ],
      validation: { required: true },
    },
    avatar: mediaMapProperty('members/{entityId}', 'Avatar'),
    linkedinUrl: {
      dataType: 'string',
      name: 'LinkedIn URL',
      url: true,
    },
    projectIds: {
      dataType: 'array',
      name: 'Projects',
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
    onPreSave: async ({ values }) => ({
      ...values,
      projectIds: referencesToIds(readValue(values, 'projectIds')),
    }),
    onSaveSuccess: async ({ context, entityId, values, previousValues }) => {
      await syncMemberProjects({
        context,
        memberId: entityId,
        previousProjectIds: readValue(previousValues, 'projectIds'),
        nextProjectIds: readValue(values, 'projectIds'),
      });
    },
  },
});

export const contentHomeCollection = buildCollection({
  id: 'content_home',
  name: 'Content: Home',
  path: 'content_home',
  customId: true,
  icon: 'home',
  properties: {
    hero: {
      dataType: 'map',
      name: 'Hero',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        body: { dataType: 'string', name: 'Body', multiline: true },
        primaryCta: {
          dataType: 'map',
          name: 'Primary CTA',
          properties: {
            label: { dataType: 'string', name: 'Label' },
            href: { dataType: 'string', name: 'Href' },
          },
        },
        secondaryCta: {
          dataType: 'map',
          name: 'Secondary CTA',
          properties: {
            label: { dataType: 'string', name: 'Label' },
            href: { dataType: 'string', name: 'Href' },
          },
        },
        slides: {
          dataType: 'array',
          name: 'Slides',
          of: {
            dataType: 'map',
            name: 'Slide',
            properties: {
              image: imageProperty('Image', 'content/content_home/{entityId}/hero-slides'),
              alt: { dataType: 'string', name: 'Alt text' },
            },
          },
        },
      },
    },
    nonprofitMap: {
      dataType: 'map',
      name: 'Nonprofit map',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        body: { dataType: 'string', name: 'Body', multiline: true },
        statusTitle: { dataType: 'string', name: 'Status title' },
        statusDescription: { dataType: 'string', name: 'Status description', multiline: true },
      },
    },
    testimonials: {
      dataType: 'map',
      name: 'Testimonials',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        items: {
          dataType: 'array',
          name: 'Items',
          of: {
            dataType: 'map',
            name: 'Testimonial',
            properties: {
              quote: { dataType: 'string', name: 'Quote', multiline: true },
              name: { dataType: 'string', name: 'Name' },
              organization: { dataType: 'string', name: 'Organization' },
            },
          },
        },
      },
    },
    newsletter: {
      dataType: 'map',
      name: 'Newsletter',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        body: { dataType: 'string', name: 'Body', multiline: true },
        subscribeHeading: { dataType: 'string', name: 'Subscribe heading' },
        subscribeSuccessMessage: { dataType: 'string', name: 'Success message' },
        card: {
          dataType: 'map',
          name: 'Card',
          properties: {
            date: { dataType: 'string', name: 'Date label' },
            sender: { dataType: 'string', name: 'Sender' },
            title: { dataType: 'string', name: 'Title' },
            recapTitle: { dataType: 'string', name: 'Recap title' },
            recapBody: { dataType: 'string', name: 'Recap body', multiline: true },
          },
        },
        stats: {
          dataType: 'array',
          name: 'Stats',
          of: {
            dataType: 'map',
            name: 'Stat',
            properties: {
              value: { dataType: 'string', name: 'Value' },
              label: { dataType: 'string', name: 'Label' },
            },
          },
        },
      },
    },
    sponsors: {
      dataType: 'map',
      name: 'Sponsors',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        tiers: {
          dataType: 'array',
          name: 'Tiers',
          of: {
            dataType: 'map',
            name: 'Tier',
            properties: {
              name: { dataType: 'string', name: 'Tier name' },
              sponsors: {
                dataType: 'array',
                name: 'Sponsors',
                of: {
                  dataType: 'map',
                  name: 'Sponsor',
                  properties: {
                    name: { dataType: 'string', name: 'Name' },
                    logo: imageProperty('Logo', 'content/content_home/{entityId}/sponsors'),
                  },
                },
              },
            },
          },
        },
      },
    },
    cta: {
      dataType: 'map',
      name: 'Bottom CTA',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        primary: {
          dataType: 'map',
          name: 'Primary',
          properties: {
            label: { dataType: 'string', name: 'Label' },
            href: { dataType: 'string', name: 'Href' },
          },
        },
        secondary: {
          dataType: 'map',
          name: 'Secondary',
          properties: {
            label: { dataType: 'string', name: 'Label' },
            href: { dataType: 'string', name: 'Href' },
          },
        },
      },
    },
  },
});

export const contentAboutCollection = buildCollection({
  id: 'content_about',
  name: 'Content: About',
  path: 'content_about',
  customId: true,
  icon: 'article',
  properties: {
    header: {
      dataType: 'map',
      name: 'Header',
      properties: {
        title: { dataType: 'string', name: 'Title' },
        paragraphs: {
          dataType: 'array',
          name: 'Paragraphs',
          of: { dataType: 'string', name: 'Paragraph' },
        },
        image: imageProperty('Image', 'content/content_about/{entityId}/header'),
        imageAlt: { dataType: 'string', name: 'Image alt' },
      },
    },
    mission: {
      dataType: 'map',
      name: 'Mission',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        body: { dataType: 'string', name: 'Body', multiline: true },
      },
    },
    values: {
      dataType: 'map',
      name: 'Values',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        items: {
          dataType: 'array',
          name: 'Items',
          of: {
            dataType: 'map',
            name: 'Value item',
            properties: {
              title: { dataType: 'string', name: 'Title' },
              description: { dataType: 'string', name: 'Description', multiline: true },
              image: imageProperty('Image', 'content/content_about/{entityId}/values'),
              imageAlt: { dataType: 'string', name: 'Image alt' },
            },
          },
        },
      },
    },
    currentProjects: {
      dataType: 'map',
      name: 'Current projects',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        linkLabel: { dataType: 'string', name: 'Link label' },
        linkHref: { dataType: 'string', name: 'Link href' },
      },
    },
  },
});

export const contentOurWorkCollection = buildCollection({
  id: 'content_our_work',
  name: 'Content: Our Work',
  path: 'content_our_work',
  customId: true,
  icon: 'article',
  properties: {
    header: {
      dataType: 'map',
      name: 'Header',
      properties: {
        title: { dataType: 'string', name: 'Title' },
        subtitle: { dataType: 'string', name: 'Subtitle' },
        image: imageProperty('Image', 'content/content_our_work/{entityId}/header'),
        imageAlt: { dataType: 'string', name: 'Image alt' },
      },
    },
  },
});

export const contentApplyStudentCollection = buildCollection({
  id: 'content_apply_student',
  name: 'Content: Apply Student',
  path: 'content_apply_student',
  customId: true,
  icon: 'article',
  properties: {
    hero: {
      dataType: 'map',
      name: 'Hero',
      properties: {
        title: { dataType: 'string', name: 'Title' },
        image: imageProperty('Image', 'content/content_apply_student/{entityId}/hero'),
      },
    },
    intro: {
      dataType: 'map',
      name: 'Intro',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        body: { dataType: 'string', name: 'Body', multiline: true },
        ctaLabel: { dataType: 'string', name: 'CTA label' },
        ctaHref: { dataType: 'string', name: 'CTA href' },
        image: imageProperty('Image', 'content/content_apply_student/{entityId}/intro'),
        imageAlt: { dataType: 'string', name: 'Image alt' },
      },
    },
    roles: {
      dataType: 'array',
      name: 'Roles',
      of: {
        dataType: 'map',
        name: 'Role',
        properties: {
          title: { dataType: 'string', name: 'Title' },
          description: { dataType: 'string', name: 'Description', multiline: true },
          icon: { dataType: 'string', name: 'Icon' },
        },
      },
    },
    timeline: {
      dataType: 'map',
      name: 'Timeline',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        description: { dataType: 'string', name: 'Description', multiline: true },
        steps: {
          dataType: 'array',
          name: 'Steps',
          of: {
            dataType: 'map',
            name: 'Step',
            properties: {
              title: { dataType: 'string', name: 'Title' },
              subtitle: { dataType: 'string', name: 'Subtitle' },
              description: { dataType: 'string', name: 'Description', multiline: true },
            },
          },
        },
      },
    },
    testimonials: {
      dataType: 'array',
      name: 'Testimonials',
      of: {
        dataType: 'map',
        name: 'Testimonial',
        properties: {
          quote: { dataType: 'string', name: 'Quote', multiline: true },
          name: { dataType: 'string', name: 'Name' },
          organization: { dataType: 'string', name: 'Organization' },
        },
      },
    },
    faq: {
      dataType: 'map',
      name: 'FAQ',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        items: {
          dataType: 'array',
          name: 'Items',
          of: {
            dataType: 'map',
            name: 'FAQ item',
            properties: {
              question: { dataType: 'string', name: 'Question' },
              answer: { dataType: 'string', name: 'Answer', multiline: true },
            },
          },
        },
      },
    },
    cta: {
      dataType: 'map',
      name: 'CTA',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        primaryLabel: { dataType: 'string', name: 'Primary label' },
        primaryHref: { dataType: 'string', name: 'Primary href' },
        secondaryLabel: { dataType: 'string', name: 'Secondary label' },
        secondaryHref: { dataType: 'string', name: 'Secondary href' },
      },
    },
  },
});

export const contentApplyNonprofitCollection = buildCollection({
  id: 'content_apply_nonprofit',
  name: 'Content: Apply Nonprofit',
  path: 'content_apply_nonprofit',
  customId: true,
  icon: 'article',
  properties: {
    hero: {
      dataType: 'map',
      name: 'Hero',
      properties: {
        title: { dataType: 'string', name: 'Title' },
        image: imageProperty('Image', 'content/content_apply_nonprofit/{entityId}/hero'),
      },
    },
    banner: {
      dataType: 'map',
      name: 'Banner',
      properties: {
        enabled: { dataType: 'boolean', name: 'Enabled' },
        text: { dataType: 'string', name: 'Text', multiline: true },
      },
    },
    intro: {
      dataType: 'map',
      name: 'Intro',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        body: { dataType: 'string', name: 'Body', multiline: true },
        ctaLabel: { dataType: 'string', name: 'CTA label' },
        ctaHref: { dataType: 'string', name: 'CTA href' },
        image: imageProperty('Image', 'content/content_apply_nonprofit/{entityId}/intro'),
        imageAlt: { dataType: 'string', name: 'Image alt' },
      },
    },
    criteria: {
      dataType: 'map',
      name: 'Criteria',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        paragraphs: {
          dataType: 'array',
          name: 'Paragraphs',
          of: { dataType: 'string', name: 'Paragraph' },
        },
      },
    },
    timeline: {
      dataType: 'map',
      name: 'Timeline',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        description: { dataType: 'string', name: 'Description', multiline: true },
        steps: {
          dataType: 'array',
          name: 'Steps',
          of: {
            dataType: 'map',
            name: 'Step',
            properties: {
              title: { dataType: 'string', name: 'Title' },
              subtitle: { dataType: 'string', name: 'Subtitle' },
              description: { dataType: 'string', name: 'Description', multiline: true },
            },
          },
        },
      },
    },
    testimonials: {
      dataType: 'array',
      name: 'Testimonials',
      of: {
        dataType: 'map',
        name: 'Testimonial',
        properties: {
          quote: { dataType: 'string', name: 'Quote', multiline: true },
          name: { dataType: 'string', name: 'Name' },
          organization: { dataType: 'string', name: 'Organization' },
        },
      },
    },
    faq: {
      dataType: 'map',
      name: 'FAQ',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        items: {
          dataType: 'array',
          name: 'Items',
          of: {
            dataType: 'map',
            name: 'FAQ item',
            properties: {
              question: { dataType: 'string', name: 'Question' },
              answer: { dataType: 'string', name: 'Answer', multiline: true },
            },
          },
        },
      },
    },
    cta: {
      dataType: 'map',
      name: 'CTA',
      properties: {
        heading: { dataType: 'string', name: 'Heading' },
        primaryLabel: { dataType: 'string', name: 'Primary label' },
        primaryHref: { dataType: 'string', name: 'Primary href' },
        secondaryLabel: { dataType: 'string', name: 'Secondary label' },
        secondaryHref: { dataType: 'string', name: 'Secondary href' },
      },
    },
  },
});

export const contentSiteSettingsCollection = buildCollection({
  id: 'content_site_settings',
  name: 'Content: Site Settings',
  path: 'content_site_settings',
  customId: true,
  icon: 'settings',
  properties: {
    navbar: {
      dataType: 'map',
      name: 'Navbar',
      properties: {
        links: {
          dataType: 'array',
          name: 'Links',
          of: {
            dataType: 'map',
            name: 'Nav link',
            properties: {
              label: { dataType: 'string', name: 'Label' },
              href: { dataType: 'string', name: 'Href' },
              dropdown: {
                dataType: 'array',
                name: 'Dropdown links',
                of: {
                  dataType: 'map',
                  name: 'Dropdown link',
                  properties: {
                    label: { dataType: 'string', name: 'Label' },
                    href: { dataType: 'string', name: 'Href' },
                  },
                },
              },
            },
          },
        },
      },
    },
    footer: {
      dataType: 'map',
      name: 'Footer',
      properties: {
        newsletterPrompt: { dataType: 'string', name: 'Newsletter prompt' },
        exploreLinks: {
          dataType: 'array',
          name: 'Explore links',
          of: {
            dataType: 'map',
            name: 'Explore link',
            properties: {
              label: { dataType: 'string', name: 'Label' },
              href: { dataType: 'string', name: 'Href' },
            },
          },
        },
        applyLinks: {
          dataType: 'array',
          name: 'Apply links',
          of: {
            dataType: 'map',
            name: 'Apply link',
            properties: {
              label: { dataType: 'string', name: 'Label' },
              href: { dataType: 'string', name: 'Href' },
            },
          },
        },
        socialLinks: {
          dataType: 'array',
          name: 'Social links',
          of: {
            dataType: 'map',
            name: 'Social link',
            properties: {
              label: { dataType: 'string', name: 'Label' },
              href: { dataType: 'string', name: 'Href' },
              icon: { dataType: 'string', name: 'Icon' },
            },
          },
        },
        contact: {
          dataType: 'map',
          name: 'Contact',
          properties: {
            addressLines: {
              dataType: 'array',
              name: 'Address lines',
              of: { dataType: 'string', name: 'Address line' },
            },
            email: { dataType: 'string', name: 'Email' },
          },
        },
      },
    },
    branding: {
      dataType: 'map',
      name: 'Branding',
      properties: {
        logo: imageProperty('Logo', 'content/content_site_settings/{entityId}/branding'),
      },
    },
  },
});

export const collections = [
  projectsCollection,
  membersCollection,
  contentHomeCollection,
  contentAboutCollection,
  contentOurWorkCollection,
  contentApplyStudentCollection,
  contentApplyNonprofitCollection,
  contentSiteSettingsCollection,
];

import { imageProperty } from './shared';

export const applicationStatusProperty = {
  dataType: 'map' as const,
  name: 'Application status',
  properties: {
    state: {
      dataType: 'string' as const,
      name: 'State',
      enumValues: [
        { id: 'closed', label: 'Closed' },
        { id: 'comingSoon', label: 'Coming soon' },
        { id: 'open', label: 'Open' },
      ],
    },
    label: { dataType: 'string' as const, name: 'Status message', multiline: true },
    applicationUrl: { dataType: 'string' as const, name: 'Verified application URL', url: true },
  },
};

export const applyCommonProperties = (collectionId: string) => ({
  applicationStatus: applicationStatusProperty,
  hero: { dataType: 'map' as const, name: 'Hero', properties: {
    title: { dataType: 'string' as const, name: 'Title' },
    image: imageProperty('Image', `content/${collectionId}/{entityId}/hero`),
  } },
  intro: { dataType: 'map' as const, name: 'Intro', properties: {
    heading: { dataType: 'string' as const, name: 'Heading' },
    body: { dataType: 'string' as const, name: 'Body', multiline: true },
    ctaLabel: { dataType: 'string' as const, name: 'CTA label' },
    ctaHref: { dataType: 'string' as const, name: 'CTA href' },
    image: imageProperty('Image', `content/${collectionId}/{entityId}/intro`),
    imageAlt: { dataType: 'string' as const, name: 'Image alt' },
  } },
  timeline: { dataType: 'map' as const, name: 'Timeline', properties: {
    heading: { dataType: 'string' as const, name: 'Heading' },
    description: { dataType: 'string' as const, name: 'Description', multiline: true },
    steps: { dataType: 'array' as const, name: 'Steps', of: { dataType: 'map' as const, name: 'Step', properties: {
      title: { dataType: 'string' as const, name: 'Title' },
      subtitle: { dataType: 'string' as const, name: 'Subtitle' },
      description: { dataType: 'string' as const, name: 'Description', multiline: true },
    } } },
  } },
  testimonials: { dataType: 'array' as const, name: 'Verified testimonials', of: {
    dataType: 'map' as const, name: 'Testimonial', properties: {
      quote: { dataType: 'string' as const, name: 'Quote', multiline: true },
      name: { dataType: 'string' as const, name: 'Name' },
      organization: { dataType: 'string' as const, name: 'Organization' },
    },
  } },
  faq: { dataType: 'map' as const, name: 'FAQ', properties: {
    heading: { dataType: 'string' as const, name: 'Heading' },
    items: { dataType: 'array' as const, name: 'Items', of: { dataType: 'map' as const, name: 'FAQ item', properties: {
      question: { dataType: 'string' as const, name: 'Question' },
      answer: { dataType: 'string' as const, name: 'Answer', multiline: true },
    } } },
  } },
  cta: { dataType: 'map' as const, name: 'CTA', properties: {
    heading: { dataType: 'string' as const, name: 'Heading' },
    primaryLabel: { dataType: 'string' as const, name: 'Primary label' },
    primaryHref: { dataType: 'string' as const, name: 'Primary href' },
    secondaryLabel: { dataType: 'string' as const, name: 'Secondary label' },
    secondaryHref: { dataType: 'string' as const, name: 'Secondary href' },
  } },
});

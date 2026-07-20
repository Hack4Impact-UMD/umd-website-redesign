import { buildContentCollection, imageProperty } from './shared';

const sectionModeProperty = (modes: Array<{ id: string; label: string }>) => ({
  dataType: 'string' as const,
  name: 'Section mode',
  enumValues: modes,
});

const publishedSectionModes = [
  { id: 'published', label: 'Published' },
  { id: 'placeholder', label: 'Placeholder' },
  { id: 'hidden', label: 'Hidden' },
];

export const contentHomeCollection = buildContentCollection({
  id: 'content_home',
  name: 'Content: Home',
  icon: 'home',
  payloadProperties: {
    hero: {
      dataType: 'map', name: 'Hero', properties: {
        heading: { dataType: 'string', name: 'Heading' },
        body: { dataType: 'string', name: 'Body', multiline: true },
        primaryCta: { dataType: 'map', name: 'Primary CTA', properties: {
          label: { dataType: 'string', name: 'Label' }, href: { dataType: 'string', name: 'Href' },
        } },
        secondaryCta: { dataType: 'map', name: 'Secondary CTA', properties: {
          label: { dataType: 'string', name: 'Label' }, href: { dataType: 'string', name: 'Href' },
        } },
        slides: { dataType: 'array', name: 'Slides', of: { dataType: 'map', name: 'Slide', properties: {
          image: imageProperty('Image', 'content/content_home/{entityId}/hero-slides'),
          alt: { dataType: 'string', name: 'Alt text' },
        } } },
      },
    },
    nonprofitMap: { dataType: 'map', name: 'Nonprofit map', properties: {
      mode: sectionModeProperty([
        { id: 'placeholder', label: 'Static preview' },
        { id: 'hidden', label: 'Hidden' },
      ]),
      heading: { dataType: 'string', name: 'Heading' },
      body: { dataType: 'string', name: 'Body', multiline: true },
      statusTitle: { dataType: 'string', name: 'Status title' },
      statusDescription: { dataType: 'string', name: 'Status description', multiline: true },
      featuredProject: { dataType: 'map', name: 'Featured project card', properties: {
        title: { dataType: 'string', name: 'Title' },
        summary: { dataType: 'string', name: 'Verified summary', multiline: true },
        href: { dataType: 'string', name: 'Project href' },
        logo: imageProperty('Logo', 'content/content_home/{entityId}/featured-project'),
        logoAlt: { dataType: 'string', name: 'Logo alt text' },
      } },
    } },
    testimonials: { dataType: 'map', name: 'Testimonials', properties: {
      mode: sectionModeProperty(publishedSectionModes),
      heading: { dataType: 'string', name: 'Heading' },
      placeholderMessage: { dataType: 'string', name: 'Placeholder message', multiline: true },
      items: { dataType: 'array', name: 'Items', of: { dataType: 'map', name: 'Testimonial', properties: {
        quote: { dataType: 'string', name: 'Quote', multiline: true },
        name: { dataType: 'string', name: 'Name' },
        organization: { dataType: 'string', name: 'Organization' },
        verified: { dataType: 'boolean', name: 'Verified' },
      } } },
    } },
    newsletter: { dataType: 'map', name: 'Newsletter', properties: {
      mode: sectionModeProperty([
        { id: 'externalLink', label: 'External links' },
        { id: 'placeholder', label: 'Placeholder' },
        { id: 'hidden', label: 'Hidden' },
      ]),
      heading: { dataType: 'string', name: 'Heading' },
      body: { dataType: 'string', name: 'Body', multiline: true },
      subscribeHeading: { dataType: 'string', name: 'Subscribe heading' },
      linkLabel: { dataType: 'string', name: 'Subscription link label' },
      subscribeUrl: { dataType: 'string', name: 'Verified subscription URL', url: true },
      placeholderMessage: { dataType: 'string', name: 'Placeholder message', multiline: true },
      latestIssue: { dataType: 'map', name: 'Latest verified issue', properties: {
        dateLabel: { dataType: 'string', name: 'Date label' },
        sender: { dataType: 'string', name: 'Sender' },
        title: { dataType: 'string', name: 'Title' },
        summary: { dataType: 'string', name: 'Summary', multiline: true },
        href: { dataType: 'string', name: 'Issue URL', url: true },
      } },
      stats: { dataType: 'array', name: 'Verified stats', of: { dataType: 'map', name: 'Stat', properties: {
        value: { dataType: 'string', name: 'Value' },
        label: { dataType: 'string', name: 'Label' },
        verified: { dataType: 'boolean', name: 'Verified' },
      } } },
    } },
    sponsors: { dataType: 'map', name: 'Sponsors and supporters', properties: {
      mode: sectionModeProperty(publishedSectionModes),
      heading: { dataType: 'string', name: 'Heading' },
      placeholderMessage: { dataType: 'string', name: 'Placeholder message', multiline: true },
      tiers: { dataType: 'array', name: 'Tiers', of: { dataType: 'map', name: 'Tier', properties: {
        name: { dataType: 'string', name: 'Tier name' },
        sponsors: { dataType: 'array', name: 'Organizations', of: { dataType: 'map', name: 'Organization', properties: {
          name: { dataType: 'string', name: 'Name' },
          logo: imageProperty('Logo', 'content/content_home/{entityId}/sponsors'),
          href: { dataType: 'string', name: 'Website', url: true },
          visible: { dataType: 'boolean', name: 'Visible' },
        } } },
      } } },
    } },
    cta: { dataType: 'map', name: 'Bottom CTA', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      primary: { dataType: 'map', name: 'Primary', properties: {
        label: { dataType: 'string', name: 'Label' }, href: { dataType: 'string', name: 'Href' },
      } },
      secondary: { dataType: 'map', name: 'Secondary', properties: {
        label: { dataType: 'string', name: 'Label' }, href: { dataType: 'string', name: 'Href' },
      } },
    } },
  },
});

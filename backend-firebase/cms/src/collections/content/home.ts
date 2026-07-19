import { buildContentCollection, imageProperty } from './shared';

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
      heading: { dataType: 'string', name: 'Heading' },
      body: { dataType: 'string', name: 'Body', multiline: true },
      statusTitle: { dataType: 'string', name: 'Status title' },
      statusDescription: { dataType: 'string', name: 'Status description', multiline: true },
    } },
    testimonials: { dataType: 'map', name: 'Testimonials', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      items: { dataType: 'array', name: 'Items', of: { dataType: 'map', name: 'Testimonial', properties: {
        quote: { dataType: 'string', name: 'Quote', multiline: true },
        name: { dataType: 'string', name: 'Name' },
        organization: { dataType: 'string', name: 'Organization' },
      } } },
    } },
    newsletter: { dataType: 'map', name: 'Newsletter', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      body: { dataType: 'string', name: 'Body', multiline: true },
      subscribeHeading: { dataType: 'string', name: 'Subscribe heading' },
      subscribeSuccessMessage: { dataType: 'string', name: 'Success message (only for a real provider)' },
      card: { dataType: 'map', name: 'Card', properties: {
        date: { dataType: 'string', name: 'Date label' }, sender: { dataType: 'string', name: 'Sender' },
        title: { dataType: 'string', name: 'Title' }, recapTitle: { dataType: 'string', name: 'Recap title' },
        recapBody: { dataType: 'string', name: 'Recap body', multiline: true },
      } },
      stats: { dataType: 'array', name: 'Verified stats', of: { dataType: 'map', name: 'Stat', properties: {
        value: { dataType: 'string', name: 'Value' }, label: { dataType: 'string', name: 'Label' },
      } } },
    } },
    sponsors: { dataType: 'map', name: 'Sponsors', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      tiers: { dataType: 'array', name: 'Tiers', of: { dataType: 'map', name: 'Tier', properties: {
        name: { dataType: 'string', name: 'Tier name' },
        sponsors: { dataType: 'array', name: 'Sponsors', of: { dataType: 'map', name: 'Sponsor', properties: {
          name: { dataType: 'string', name: 'Name' },
          logo: imageProperty('Logo', 'content/content_home/{entityId}/sponsors'),
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

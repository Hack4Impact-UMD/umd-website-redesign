import { buildContentCollection, imageProperty } from './shared';

const linkProperty = (name: string) => ({
  dataType: 'map' as const, name, properties: {
    label: { dataType: 'string' as const, name: 'Label' },
    href: { dataType: 'string' as const, name: 'Href' },
  },
});

export const contentSiteSettingsCollection = buildContentCollection({
  id: 'content_site_settings',
  name: 'Content: Site Settings',
  icon: 'settings',
  payloadProperties: {
    navbar: { dataType: 'map', name: 'Navbar', properties: {
      links: { dataType: 'array', name: 'Links', of: { dataType: 'map', name: 'Nav link', properties: {
        label: { dataType: 'string', name: 'Label' },
        href: { dataType: 'string', name: 'Href' },
        dropdown: { dataType: 'array', name: 'Dropdown links', of: linkProperty('Dropdown link') },
      } } },
    } },
    footer: { dataType: 'map', name: 'Footer', properties: {
      newsletterPrompt: { dataType: 'string', name: 'Newsletter prompt' },
      newsletterUrl: { dataType: 'string', name: 'Newsletter URL', url: true },
      exploreLinks: { dataType: 'array', name: 'Explore links', of: linkProperty('Explore link') },
      applyLinks: { dataType: 'array', name: 'Apply links', of: linkProperty('Apply link') },
      socialLinks: { dataType: 'array', name: 'Social links', of: { dataType: 'map', name: 'Social link', properties: {
        label: { dataType: 'string', name: 'Label' }, href: { dataType: 'string', name: 'Href' },
        icon: { dataType: 'string', name: 'Icon' },
      } } },
      contact: { dataType: 'map', name: 'Contact', properties: {
        addressLines: { dataType: 'array', name: 'Address lines', of: { dataType: 'string', name: 'Address line' } },
        email: { dataType: 'string', name: 'Email' },
      } },
    } },
    branding: { dataType: 'map', name: 'Branding', properties: {
      logo: imageProperty('Logo', 'content/content_site_settings/{entityId}/branding'),
    } },
  },
});

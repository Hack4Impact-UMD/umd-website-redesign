import { buildContentCollection, imageProperty } from './shared';

const linkProperty = (name: string) => ({
  dataType: 'map' as const, name, properties: {
    label: { dataType: 'string' as const, name: 'Label' },
    href: { dataType: 'string' as const, name: 'Href', contentValidation: 'cta' as const },
  },
});

export const contentSiteSettingsCollection = buildContentCollection({
  id: 'content_site_settings',
  name: 'Content: Site Settings',
  icon: 'settings',
  optionalPayloadPaths: ['navbar.links[].dropdown', 'footer.newsletterUrl'],
  payloadProperties: {
    navbar: { dataType: 'map', name: 'Navbar', properties: {
      links: { dataType: 'array', name: 'Links', validation: { required: true, min: 1 }, of: { dataType: 'map', name: 'Nav link', properties: {
        label: { dataType: 'string', name: 'Label' },
        href: { dataType: 'string', name: 'Href', contentValidation: 'cta' },
        dropdown: { dataType: 'array', name: 'Dropdown links', of: linkProperty('Dropdown link') },
      } } },
    } },
    footer: { dataType: 'map', name: 'Footer', properties: {
      newsletterPrompt: { dataType: 'string', name: 'Newsletter prompt' },
      newsletterUrl: { dataType: 'string', name: 'Newsletter URL', url: true, contentValidation: 'https' },
      exploreLinks: { dataType: 'array', name: 'Explore links', of: linkProperty('Explore link') },
      applyLinks: { dataType: 'array', name: 'Apply links', of: linkProperty('Apply link') },
      socialLinks: { dataType: 'array', name: 'Social links', of: { dataType: 'map', name: 'Social link', properties: {
        label: { dataType: 'string', name: 'Label' },
        href: { dataType: 'string', name: 'Href', url: true, contentValidation: 'https' },
        icon: { dataType: 'string', name: 'Icon', enumValues: [
          { id: 'Instagram', label: 'Instagram' },
          { id: 'Github', label: 'GitHub' },
          { id: 'Linkedin', label: 'LinkedIn' },
          { id: 'Facebook', label: 'Facebook' },
        ] },
      } } },
      contact: { dataType: 'map', name: 'Contact', properties: {
        addressLines: { dataType: 'array', name: 'Address lines', validation: { min: 1 }, of: { dataType: 'string', name: 'Address line' } },
        email: { dataType: 'string', name: 'Email', contentValidation: 'email' },
      } },
    } },
    branding: { dataType: 'map', name: 'Branding', properties: {
      logo: imageProperty('Logo', 'content/content_site_settings/{entityId}/branding'),
    } },
  },
});

import { buildContentCollection, imageProperty } from './shared';

export const contentAboutCollection = buildContentCollection({
  id: 'content_about',
  name: 'Content: About',
  optionalPayloadPaths: [
    'story',
    'story.items[].links',
    'story.items[].image',
    'story.items[].imageAlt',
    'highlights',
    'currentProjects.projectPaths',
  ],
  payloadProperties: {
    header: { dataType: 'map', name: 'Header', properties: {
      title: { dataType: 'string', name: 'Title' },
      paragraphs: { dataType: 'array', name: 'Paragraphs', of: { dataType: 'string', name: 'Paragraph' } },
      image: imageProperty('Image', 'content/content_about/{entityId}/header'),
      imageAlt: { dataType: 'string', name: 'Image alt' },
    } },
    mission: { dataType: 'map', name: 'Mission', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      body: { dataType: 'string', name: 'Body', multiline: true },
    } },
    story: { dataType: 'map', name: 'Story timeline', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      intro: { dataType: 'string', name: 'Introduction', multiline: true },
      items: { dataType: 'array', name: 'Timeline items', of: { dataType: 'map', name: 'Timeline item', properties: {
        label: { dataType: 'string', name: 'Label' },
        title: { dataType: 'string', name: 'Title' },
        description: { dataType: 'string', name: 'Description', multiline: true },
        links: { dataType: 'array', name: 'Related links', of: { dataType: 'map', name: 'Link', properties: {
          label: { dataType: 'string', name: 'Label' },
          href: { dataType: 'string', name: 'URL', url: true, contentValidation: 'cta' },
        } } },
        image: imageProperty('Image', 'content/content_about/{entityId}/story'),
        imageAlt: { dataType: 'string', name: 'Image alt' },
      } } },
    } },
    highlights: { dataType: 'map', name: 'At a glance', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      items: { dataType: 'array', name: 'Six highlights', validation: { min: 6, max: 6 }, of: { dataType: 'map', name: 'Highlight', properties: {
        value: { dataType: 'string', name: 'Value' },
        label: { dataType: 'string', name: 'Label' },
      } } },
    } },
    values: { dataType: 'map', name: 'Values', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      items: { dataType: 'array', name: 'Items', of: { dataType: 'map', name: 'Value item', properties: {
        title: { dataType: 'string', name: 'Title' },
        description: { dataType: 'string', name: 'Description', multiline: true },
        image: imageProperty('Image', 'content/content_about/{entityId}/values'),
        imageAlt: { dataType: 'string', name: 'Image alt' },
      } } },
    } },
    currentProjects: { dataType: 'map', name: 'Current projects', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      linkLabel: { dataType: 'string', name: 'Link label' },
      linkHref: { dataType: 'string', name: 'Link href', contentValidation: 'cta' },
      projectPaths: { dataType: 'array', name: 'Curated project paths', of: { dataType: 'string', name: 'Project path' } },
    } },
  },
});

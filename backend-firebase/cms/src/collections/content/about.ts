import { buildContentCollection, imageProperty } from './shared';

export const contentAboutCollection = buildContentCollection({
  id: 'content_about',
  name: 'Content: About',
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
      linkHref: { dataType: 'string', name: 'Link href' },
      projectPaths: { dataType: 'array', name: 'Curated project paths', of: { dataType: 'string', name: 'Project path' } },
    } },
  },
});

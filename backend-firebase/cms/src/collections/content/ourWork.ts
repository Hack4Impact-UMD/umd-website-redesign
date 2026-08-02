import { buildContentCollection, imageProperty } from './shared';

export const contentOurWorkCollection = buildContentCollection({
  id: 'content_our_work',
  name: 'Content: Our Work',
  payloadProperties: {
    header: { dataType: 'map', name: 'Header', properties: {
      title: { dataType: 'string', name: 'Title' },
      subtitle: { dataType: 'string', name: 'Subtitle' },
      image: imageProperty('Image', 'content/content_our_work/{entityId}/header'),
      imageAlt: { dataType: 'string', name: 'Image alt' },
    } },
  },
});

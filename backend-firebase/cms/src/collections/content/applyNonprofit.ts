import { applyCommonProperties } from './applyShared';
import { buildContentCollection } from './shared';

export const contentApplyNonprofitCollection = buildContentCollection({
  id: 'content_apply_nonprofit',
  name: 'Content: Apply Nonprofit',
  payloadProperties: {
    ...applyCommonProperties('content_apply_nonprofit'),
    banner: { dataType: 'map', name: 'Banner', properties: {
      enabled: { dataType: 'boolean', name: 'Enabled' },
      text: { dataType: 'string', name: 'Text', multiline: true },
    } },
    criteria: { dataType: 'map', name: 'Criteria', properties: {
      heading: { dataType: 'string', name: 'Heading' },
      paragraphs: { dataType: 'array', name: 'Paragraphs', of: { dataType: 'string', name: 'Paragraph' } },
    } },
  },
});

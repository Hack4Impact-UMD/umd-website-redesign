import { applyCommonProperties } from './applyShared';
import { buildContentCollection } from './shared';

export const contentApplyStudentCollection = buildContentCollection({
  id: 'content_apply_student',
  name: 'Content: Apply Student',
  payloadProperties: {
    ...applyCommonProperties('content_apply_student'),
    roles: { dataType: 'array', name: 'Roles', of: { dataType: 'map', name: 'Role', properties: {
      title: { dataType: 'string', name: 'Title' },
      description: { dataType: 'string', name: 'Description', multiline: true },
      icon: { dataType: 'string', name: 'Icon' },
    } } },
  },
});

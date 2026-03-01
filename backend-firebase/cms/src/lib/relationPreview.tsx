import { PropertyPreviewProps, ReferencePreview } from '@firecms/core';
import { useMemo } from 'react';
import { normalizeReferences } from './relationAdapters';

const MAX_PREVIEW_ITEMS = 3;

type RelationPreviewProps = PropertyPreviewProps<any[]> & {
  relationPath: string;
  previewProperties: string[];
};

const RelationPreview = ({
  value,
  size,
  relationPath,
  previewProperties,
}: RelationPreviewProps) => {
  const references = useMemo(
    () => normalizeReferences(value, relationPath),
    [value, relationPath],
  );

  if (references.length === 0) {
    return <span>-</span>;
  }

  const visibleReferences = references.slice(0, MAX_PREVIEW_ITEMS);
  const remainingCount = references.length - visibleReferences.length;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      {visibleReferences.map((reference) => (
        <ReferencePreview
          key={`${reference.path}/${reference.id}`}
          reference={reference}
          size={size}
          previewProperties={previewProperties}
          includeId={false}
          includeEntityLink={false}
        />
      ))}
      {remainingCount > 0 ? (
        <span style={{ fontSize: 12, opacity: 0.7 }}>+{remainingCount} more</span>
      ) : null}
    </div>
  );
};

export const membersPreview = (props: PropertyPreviewProps<any[]>) => (
  <RelationPreview
    {...props}
    relationPath="members"
    previewProperties={['firstName', 'lastName']}
  />
);

export const projectsPreview = (props: PropertyPreviewProps<any[]>) => (
  <RelationPreview
    {...props}
    relationPath="projects"
    previewProperties={['title', 'path']}
  />
);

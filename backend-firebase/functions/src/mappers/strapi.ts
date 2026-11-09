import {
  MemberRecord,
  ProjectRecord,
  StrapiCollectionResponse,
  StrapiEntity,
  StrapiMemberAttributes,
  StrapiProjectAttributes,
} from '../models';
import { toIsoDateString } from '../utils/date';
import { toPublicMediaUrl } from '../utils/media';
import { normalizeRelationIds } from '../utils/relations';

const toAvatarData = (member: MemberRecord): StrapiMemberAttributes['avatar'] => {
  const avatarUrl = toPublicMediaUrl(member.avatar?.url);
  if (!avatarUrl) {
    return { data: null };
  }

  return {
    data: {
      id: `${member.id}_avatar`,
      attributes: {
        url: avatarUrl,
      },
    },
  };
};

export const mapMemberToStrapiEntity = (
  member: MemberRecord,
): StrapiEntity<StrapiMemberAttributes> => {
  const normalizedRoles = (member.componentRolesArr ?? [])
    .filter((role) => role.title !== null)
    .map((role) => ({
      title: role.title,
      isDisplayRole: role.isDisplayRole,
      team: role.team,
      startDate: toIsoDateString(role.startDate),
      endDate: toIsoDateString(role.endDate),
    }));

  return {
    id: member.id,
    attributes: {
      firstName: member.firstName,
      lastName: member.lastName,
      pronouns: member.pronouns,
      linkedinUrl: member.linkedinUrl,
      memberDisplayStatus: member.memberDisplayStatus,
      componentRolesArr: normalizedRoles,
      avatar: toAvatarData(member),
    },
  };
};

const isDimension = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

// Same public-URL rules as `image`: a screenshot with an unsafe or missing path is dropped.
const mapScreenshots = (project: ProjectRecord): StrapiProjectAttributes['screenshots']['data'] =>
  (project.screenshots ?? []).flatMap((asset, index) => {
    const url = asset && typeof asset === 'object' ? toPublicMediaUrl(asset.url) : null;
    if (!url) return [];
    const alt = typeof asset.alt === 'string' ? asset.alt.trim() : '';
    return [
      {
        id: `${project.id}_screenshot_${index}`,
        attributes: {
          url,
          ...(alt ? { alternativeText: alt } : {}),
          // Both or neither: one dimension alone says nothing about the shape.
          ...(isDimension(asset.width) && isDimension(asset.height)
            ? { width: asset.width, height: asset.height }
            : {}),
        },
      },
    ];
  });

export const mapProjectToStrapiEntity = (
  project: ProjectRecord,
  membersById: Map<string, MemberRecord>,
): StrapiEntity<StrapiProjectAttributes> => {
  const memberEntities = normalizeRelationIds(project.memberIds)
    .map((memberId) => membersById.get(memberId))
    .filter((member): member is MemberRecord => Boolean(member))
    .map(mapMemberToStrapiEntity);

  return {
    id: project.id,
    attributes: {
      title: project.title,
      path: project.path,
      startDate: toIsoDateString(project.startDate) ?? undefined,
      summary: project.summary,
      blurb: project.blurb,
      isFeatured: project.isFeatured,
      isCurrentProject: project.isCurrentProject,
      repoURL: project.repoURL,
      hostedProjectURL: project.hostedProjectURL,
      imageAltText: project.imageAltText,
      nonprofit: {
        data: project.nonprofitName
          ? {
              id: `${project.id}_nonprofit`,
              attributes: {
                name: project.nonprofitName,
              },
            }
          : null,
      },
      image: {
        data: (project.image ?? [])
          .map((asset) => {
            const url = toPublicMediaUrl(asset.url);
            return url ? { ...asset, url } : null;
          })
          .filter((asset): asset is { url: string } => Boolean(asset?.url))
          .map((asset, index) => ({
            id: `${project.id}_image_${index}`,
            attributes: {
              url: asset.url,
            },
          })),
      },
      screenshots: {
        data: mapScreenshots(project),
      },
      members: {
        data: memberEntities,
      },
    },
  };
};

export const buildCollectionResponse = <TAttributes>(
  data: Array<StrapiEntity<TAttributes>>,
  page: number,
  pageSize: number,
  total: number,
): StrapiCollectionResponse<TAttributes> => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return {
    data,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total,
      },
    },
  };
};

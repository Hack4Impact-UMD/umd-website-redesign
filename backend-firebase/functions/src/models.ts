import type { Timestamp } from 'firebase-admin/firestore';

export type DateLike = string | Date | Timestamp | null | undefined;

export interface MediaAsset {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface MemberRole {
  title: string;
  isDisplayRole: boolean;
  team?: string;
  startDate?: DateLike;
  endDate?: DateLike;
}

export type MemberDisplayStatus =
  | 'Current Member'
  | 'Current Board Member'
  | 'Former Member or Board Member';

export interface MemberRecord {
  id: string;
  firstName: string;
  lastName: string;
  pronouns?: string;
  avatar?: MediaAsset | null;
  componentRolesArr: MemberRole[];
  memberDisplayStatus: MemberDisplayStatus;
  projectIds: string[];
  linkedinUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  path: string;
  startDate?: DateLike;
  summary: string;
  blurb: string;
  isFeatured: boolean;
  isCurrentProject: boolean;
  repoURL?: string;
  hostedProjectURL?: string;
  imageAltText?: string;
  image: MediaAsset[];
  memberIds: string[];
  nonprofitName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type StrapiEntity<TAttributes> = {
  id: string;
  attributes: TAttributes;
};

export type StrapiCollectionResponse<TAttributes> = {
  data: StrapiEntity<TAttributes>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export interface StrapiProjectAttributes {
  title: string;
  path: string;
  startDate?: string;
  summary: string;
  blurb: string;
  isFeatured: boolean;
  isCurrentProject: boolean;
  repoURL?: string;
  hostedProjectURL?: string;
  imageAltText?: string;
  nonprofit?: {
    data: {
      id: string;
      attributes: {
        name: string;
      };
    } | null;
  };
  image: {
    data: Array<{
      id: string;
      attributes: {
        url: string;
      };
    }>;
  };
  members: {
    data: Array<StrapiEntity<StrapiMemberAttributes>>;
  };
}

export interface StrapiMemberAttributes {
  firstName: string;
  lastName: string;
  pronouns?: string;
  linkedinUrl?: string;
  memberDisplayStatus: MemberDisplayStatus;
  componentRolesArr: Array<{
    title: string;
    isDisplayRole: boolean;
    team?: string;
    startDate?: string | null;
    endDate?: string | null;
  }>;
  avatar: {
    data:
      | {
          id: string;
          attributes: {
            url: string;
          };
        }
      | null;
  };
}

export interface ContentResponse<TData> {
  data: TData | null;
  meta: {
    collection: string;
    documentId: string;
  };
}

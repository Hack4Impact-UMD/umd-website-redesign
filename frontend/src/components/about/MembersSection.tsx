import { useCallback } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonCard from './PersonCard';
import { getMembers } from '@/api/compat';
import { useApiData } from '@/hooks/useApiData';
import {
  MemberDisplayStatus,
  StrapiCollectionResponse,
  StrapiMemberAttributes,
} from '@/api/types';

interface MembersSectionProps {
  title: string;
  filterStatus: 'Current Board Member' | 'Current Member';
}

const EXEC_ORDER = [
  'Executive Director',
  'Director of Product',
  'Director of Engineering',
  'Director of Design',
  'Director of Education',
  'Director of Finance and Sponsorship',
  'Director of Events',
  'Director of Recruitment',
  'Director of Public Relations and Outreach',
  'Senior Advisor',
];

const emptyMembersResponse: StrapiCollectionResponse<StrapiMemberAttributes> = {
  data: [],
  meta: {
    pagination: {
      page: 1,
      pageSize: 100,
      pageCount: 1,
      total: 0,
    },
  },
};

function getDisplayRole(roles: StrapiMemberAttributes['componentRolesArr']) {
  return roles.find((role) => role.isDisplayRole);
}

export default function MembersSection({ title, filterStatus }: MembersSectionProps) {
  const loader = useCallback(
    () =>
      getMembers({
        filterStatus: filterStatus as MemberDisplayStatus,
        page: 1,
        pageSize: 100,
      }),
    [filterStatus],
  );

  const response = useApiData(loader, emptyMembersResponse);
  const members = response.data.data || [];

  const sortedMembers =
    filterStatus === 'Current Board Member'
      ? [...members].sort((a, b) => {
          const aRole = getDisplayRole(a.attributes.componentRolesArr)?.title || '';
          const bRole = getDisplayRole(b.attributes.componentRolesArr)?.title || '';
          return EXEC_ORDER.indexOf(aRole) - EXEC_ORDER.indexOf(bRole);
        })
      : members;

  return (
    <section className="py-16 px-6 lg:px-16 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
          {title}
        </h2>
        {!response.loaded ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {sortedMembers.map((member) => {
              const { firstName, lastName, avatar, componentRolesArr } = member.attributes;
              const displayRole = getDisplayRole(componentRolesArr);
              const memberName = `${firstName} ${lastName}`;

              return (
                <PersonCard
                  key={member.id}
                  name={memberName}
                  role={displayRole?.title || ''}
                  imageSrc={avatar?.data?.attributes.url}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

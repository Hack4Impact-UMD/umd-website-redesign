import { getMembers, type MemberEntity } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AsyncError } from '@/components/shared';
import { useApiResource } from '@/hooks';
import PersonCard from './PersonCard';

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

interface RoleData {
  isDisplayRole: boolean;
  title: string;
  team?: string;
}

function getDisplayRole(roles: RoleData[]): RoleData | undefined {
  return roles.find((r) => r.isDisplayRole);
}

export default function MembersSection({ title, filterStatus }: MembersSectionProps) {
  const res = useApiResource(
    (signal) => getMembers({ filterStatus, pageSize: 200, signal }),
    [filterStatus],
  );

  const members: MemberEntity[] = res.data ?? [];

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
        {res.status === 'loading' ? (
          <LoadingSpinner />
        ) : res.status === 'error' ? (
          <AsyncError message="Members are unavailable right now." onRetry={res.retry} />
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

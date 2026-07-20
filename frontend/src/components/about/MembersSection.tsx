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

type MemberRole = MemberEntity['attributes']['componentRolesArr'][number];

function getDisplayRole(roles: MemberRole[]): MemberRole | undefined {
  return roles.find((r) => r.isDisplayRole);
}

export default function MembersSection({ title, filterStatus }: MembersSectionProps) {
  const headingId = filterStatus === 'Current Board Member' ? 'board-heading' : 'members-heading';
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
          const aRank = EXEC_ORDER.indexOf(aRole);
          const bRank = EXEC_ORDER.indexOf(bRole);
          const roleOrder =
            (aRank === -1 ? EXEC_ORDER.length : aRank) -
            (bRank === -1 ? EXEC_ORDER.length : bRank);
          if (roleOrder !== 0) return roleOrder;
          return `${a.attributes.firstName} ${a.attributes.lastName}`.localeCompare(
            `${b.attributes.firstName} ${b.attributes.lastName}`,
          );
        })
      : members;

  return (
    <section className="bg-background px-6 py-12 sm:px-8 lg:px-24" aria-labelledby={headingId}>
      <div className="mx-auto max-w-[1248px]">
        <h2 id={headingId} className="mb-10 text-center font-heading text-h2 font-bold text-foreground">
          {title}
        </h2>
        {res.status === 'loading' ? (
          <LoadingSpinner />
        ) : res.status === 'error' ? (
          <AsyncError message="Members are unavailable right now." onRetry={res.retry} />
        ) : sortedMembers.length === 0 ? (
          <p className="text-center text-base text-muted-foreground">
            No board members are published right now.
          </p>
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
            {sortedMembers.map((member) => {
              const { firstName, lastName, avatar, componentRolesArr, linkedinUrl } = member.attributes;
              const displayRole = getDisplayRole(componentRolesArr);
              const memberName = `${firstName} ${lastName}`;

              return (
                <PersonCard
                  key={member.id}
                  name={memberName}
                  role={displayRole?.title || ''}
                  imageSrc={avatar?.data?.attributes.url}
                  linkedinUrl={linkedinUrl}
                  prominent
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

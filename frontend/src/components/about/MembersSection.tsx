import type { MemberEntity } from '@/api';
import PersonCard from './PersonCard';

interface MembersSectionProps {
  title: string;
  filterStatus: 'Current Board Member' | 'Current Member';
  /** Fetched at build time by the page; already filtered to filterStatus. */
  memberEntities: MemberEntity[];
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

export default function MembersSection({
  title,
  filterStatus,
  memberEntities,
}: MembersSectionProps) {
  const isBoard = filterStatus === 'Current Board Member';
  const headingId = isBoard ? 'board-heading' : 'members-heading';
  const members: MemberEntity[] = memberEntities;

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
      : [...members].sort((a, b) =>
          `${a.attributes.firstName} ${a.attributes.lastName}`.localeCompare(
            `${b.attributes.firstName} ${b.attributes.lastName}`,
          ),
        );

  return (
    <section
      className={`px-6 py-16 sm:px-8 lg:px-24 lg:py-24 ${isBoard ? 'bg-[#F1F3F5]' : 'bg-white'}`}
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-[1248px]">
        <h2 id={headingId} className="mb-10 text-section text-foreground">
          {title}
        </h2>
        {sortedMembers.length === 0 ? (
          <p className="text-base text-muted-foreground">
            {filterStatus === 'Current Board Member'
              ? 'No board members are available right now.'
              : 'No current members are available right now.'}
          </p>
        ) : (
          <div
            className={
              isBoard
                ? 'grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8'
                : 'grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6'
            }
          >
            {sortedMembers.map((member) => {
              const { firstName, lastName, pronouns, avatar, componentRolesArr, linkedinUrl } = member.attributes;
              const displayRole = getDisplayRole(componentRolesArr);
              const memberName = `${firstName} ${lastName}`;

              return (
                <PersonCard
                  key={member.id}
                  name={memberName}
                  role={displayRole?.title || ''}
                  pronouns={pronouns}
                  team={displayRole?.team}
                  imageSrc={avatar?.data?.attributes.url}
                  linkedinUrl={linkedinUrl}
                  prominent={filterStatus === 'Current Board Member'}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

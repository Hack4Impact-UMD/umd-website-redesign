import type { MemberEntity } from '@/api';
import PersonCard from './PersonCard';

interface MembersSectionProps {
  title: string;
  filterStatus: 'Current Board Member' | 'Current Member';
  /** Fetched at build time by the page; already filtered to filterStatus. */
  memberEntities: MemberEntity[];
  /**
   * Former members, fetched at build time. When given, the section shows
   * "Current members" and "Alumni" tabs; the tab script lives in aboutus.astro.
   */
  alumniEntities?: MemberEntity[];
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

const fullName = (member: MemberEntity) =>
  `${member.attributes.firstName} ${member.attributes.lastName}`;

const byName = (a: MemberEntity, b: MemberEntity) => fullName(a).localeCompare(fullName(b));

const byExecRole = (a: MemberEntity, b: MemberEntity) => {
  const rank = (member: MemberEntity) => {
    const index = EXEC_ORDER.indexOf(getDisplayRole(member.attributes.componentRolesArr)?.title || '');
    return index === -1 ? EXEC_ORDER.length : index;
  };
  return rank(a) - rank(b) || byName(a, b);
};

interface MemberGridProps {
  members: MemberEntity[];
  prominent: boolean;
  emptyMessage: string;
}

function MemberGrid({ members, prominent, emptyMessage }: MemberGridProps) {
  if (members.length === 0) {
    return <p className="text-base text-muted-foreground">{emptyMessage}</p>;
  }

  const gridClassName = prominent
    ? 'grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8'
    : 'grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6';

  const renderMember = (member: MemberEntity) => {
    const { pronouns, avatar, componentRolesArr, linkedinUrl } = member.attributes;
    const displayRole = getDisplayRole(componentRolesArr);

    return (
      <PersonCard
        key={member.id}
        name={fullName(member)}
        role={displayRole?.title || ''}
        pronouns={pronouns}
        team={displayRole?.team}
        imageSrc={avatar?.data?.attributes.url}
        linkedinUrl={linkedinUrl}
        prominent={prominent}
      />
    );
  };

  return <div className={gridClassName}>{members.map(renderMember)}</div>;
}

const TAB_CLASS =
  '-mb-px border-b-2 border-transparent px-1 pb-3 font-heading text-lg font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2 aria-selected:border-h4i-blue aria-selected:text-h4i-blue';

export default function MembersSection({
  title,
  filterStatus,
  memberEntities,
  alumniEntities,
}: MembersSectionProps) {
  const isBoard = filterStatus === 'Current Board Member';
  const headingId = isBoard ? 'board-heading' : 'members-heading';
  const sortedMembers = [...memberEntities].sort(isBoard ? byExecRole : byName);

  const currentGrid = (
    <MemberGrid
      members={sortedMembers}
      prominent={isBoard}
      emptyMessage={
        isBoard ? 'No board members are available right now.' : 'No current members are available right now.'
      }
    />
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
        {alumniEntities ? (
          <div data-tabs>
            <div
              role="tablist"
              aria-labelledby={headingId}
              className="mb-10 flex gap-8 border-b border-border"
            >
              <button
                type="button"
                role="tab"
                id="members-tab-current"
                aria-controls="members-panel-current"
                aria-selected="true"
                tabIndex={0}
                className={TAB_CLASS}
              >
                Current members
              </button>
              <button
                type="button"
                role="tab"
                id="members-tab-alumni"
                aria-controls="members-panel-alumni"
                aria-selected="false"
                tabIndex={-1}
                className={TAB_CLASS}
              >
                Alumni
              </button>
            </div>
            <div
              role="tabpanel"
              id="members-panel-current"
              aria-labelledby="members-tab-current"
              tabIndex={0}
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-4"
            >
              {currentGrid}
            </div>
            <div
              role="tabpanel"
              id="members-panel-alumni"
              aria-labelledby="members-tab-alumni"
              tabIndex={0}
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-4"
              hidden
            >
              <p className="mb-8 text-base text-muted-foreground">
                Alum and don’t see yourself here?{' '}
                <a
                  href="/contactus"
                  className="font-bold text-h4i-blue underline underline-offset-4 transition-colors hover:text-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                >
                  Let us know
                </a>{' '}
                and we’ll add you.
              </p>
              <MemberGrid
                members={[...alumniEntities].sort(byName)}
                prominent={false}
                emptyMessage="No alumni are listed right now."
              />
            </div>
          </div>
        ) : (
          currentGrid
        )}
      </div>
    </section>
  );
}

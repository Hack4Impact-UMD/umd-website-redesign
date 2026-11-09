import type { MemberEntity, ProjectEntity } from '@/api';
import {
  AboutHeader,
  CurrentProjectsSection,
  MembersSection,
  StoryTimelineSection,
  ValuesSection,
} from '@/components/about';
import CTASection from '@/components/home/CTASection';
import { defaultAboutContent, normalizeAboutContent } from '@/content-schema/about';
import { defaultHomeContent } from '@/content-schema/home';

type ResolvedAboutContent = NonNullable<ReturnType<typeof normalizeAboutContent>['content']>;

interface AboutSectionsProps {
  content: ResolvedAboutContent;
  currentProjects: ProjectEntity[];
  boardMembers: MemberEntity[];
  teamMembers: MemberEntity[];
  alumni: MemberEntity[];
}

/**
 * The About page body. Content and collections are resolved by the .astro page
 * at build time; this component is purely presentational and ships no JS. The members
 * tabs are driven by a small script in aboutus.astro.
 */
export default function AboutSections({
  content,
  currentProjects,
  boardMembers,
  teamMembers,
  alumni,
}: AboutSectionsProps) {
  const {
    header,
    story = defaultAboutContent.story,
    values,
    currentProjects: currentProjectsContent,
  } = content;

  return (
    <main className="flex flex-col bg-background">
      <AboutHeader {...header} />
      <StoryTimelineSection {...story} />
      <ValuesSection {...values} />
      <CurrentProjectsSection {...currentProjectsContent} projectEntities={currentProjects} />
      <MembersSection
        title="Meet the board"
        filterStatus="Current Board Member"
        memberEntities={boardMembers}
      />
      <MembersSection
        title="Meet the team"
        filterStatus="Current Member"
        memberEntities={teamMembers}
        alumniEntities={alumni}
      />
      {/* Same closing invitation as the home page. */}
      <CTASection content={defaultHomeContent.cta} />
    </main>
  );
}

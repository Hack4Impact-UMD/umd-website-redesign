import type { MemberEntity, ProjectEntity } from '@/api';
import {
  AboutHeader,
  CurrentProjectsSection,
  HighlightsSection,
  MembersSection,
  StoryTimelineSection,
  ValuesSection,
} from '@/components/about';
import { defaultAboutContent, normalizeAboutContent } from '@/content-schema/about';

type ResolvedAboutContent = NonNullable<ReturnType<typeof normalizeAboutContent>['content']>;

interface AboutSectionsProps {
  content: ResolvedAboutContent;
  currentProjects: ProjectEntity[];
  boardMembers: MemberEntity[];
  teamMembers: MemberEntity[];
}

/**
 * The About page body. Content and collections are resolved by the .astro page
 * at build time; this component is purely presentational and ships no JS.
 */
export default function AboutSections({
  content,
  currentProjects,
  boardMembers,
  teamMembers,
}: AboutSectionsProps) {
  const {
    header,
    story = defaultAboutContent.story,
    highlights = defaultAboutContent.highlights,
    values,
    currentProjects: currentProjectsContent,
  } = content;

  return (
    <main className="flex flex-col bg-background font-karla">
      <AboutHeader {...header} />
      <StoryTimelineSection {...story} />
      <HighlightsSection {...highlights} />
      <ValuesSection {...values} />
      <CurrentProjectsSection {...currentProjectsContent} projectEntities={currentProjects} />
      <MembersSection
        title="Meet the Board"
        filterStatus="Current Board Member"
        memberEntities={boardMembers}
      />
      <MembersSection
        title="Meet the Team"
        filterStatus="Current Member"
        memberEntities={teamMembers}
      />
    </main>
  );
}

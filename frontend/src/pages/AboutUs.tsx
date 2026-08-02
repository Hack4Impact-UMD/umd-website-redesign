import { getContentDocument } from '@/api';
import {
  AboutHeader,
  StoryTimelineSection,
  HighlightsSection,
  ValuesSection,
  CurrentProjectsSection,
  MembersSection,
} from '@/components/about';
import LoadingSpinner from '@/components/LoadingSpinner';
import { defaultAboutContent, normalizeAboutContent } from '@/content/about';
import { useApiResource } from '@/hooks';

export default function AboutUs() {
  const result = useApiResource((signal) => getContentDocument('about', signal), []);

  if (result.status === 'loading') {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-background px-6 py-16">
        <LoadingSpinner text="Loading About page..." />
      </main>
    );
  }

  const resolved = normalizeAboutContent(
    result.status === 'error' ? { mode: 'placeholder' } : result.data,
  );
  if (!resolved.content) return null;

  const {
    header,
    story = defaultAboutContent.story,
    highlights = defaultAboutContent.highlights,
    values,
    currentProjects,
  } = resolved.content;

  return (
    <main className="flex flex-col bg-background font-karla">
      <AboutHeader {...header} />
      <StoryTimelineSection {...story} />
      <HighlightsSection {...highlights} />
      <ValuesSection {...values} />
      <CurrentProjectsSection {...currentProjects} />
      <MembersSection title="Meet the Board" filterStatus="Current Board Member" />
      <MembersSection title="Meet the Team" filterStatus="Current Member" />
    </main>
  );
}

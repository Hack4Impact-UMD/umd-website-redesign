import { getContentDocument } from '@/api';
import {
  AboutHeader,
  MissionSection,
  ValuesSection,
  CurrentProjectsSection,
  MembersSection,
} from '@/components/about';
import LoadingSpinner from '@/components/LoadingSpinner';
import { normalizeAboutContent } from '@/content/about';
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

  const { header, mission, values, currentProjects } = resolved.content;

  return (
    <main className="flex flex-col gap-6 bg-background font-karla">
      <AboutHeader {...header} />
      <MissionSection {...mission} />
      <ValuesSection {...values} />
      <CurrentProjectsSection {...currentProjects} />
      <MembersSection title="Meet the Board" filterStatus="Current Board Member" />
    </main>
  );
}

import {
  AboutHeader,
  MissionSection,
  ValuesSection,
  CurrentProjectsSection,
  MembersSection,
} from '@/components/about';

export default function AboutUs() {
  return (
    <main className="bg-background">
      <AboutHeader />
      <MissionSection />
      <ValuesSection />
      <CurrentProjectsSection />
      <MembersSection title="Meet the Board" filterStatus="Current Board Member" />
      <MembersSection title="Team Members" filterStatus="Current Member" />
    </main>
  );
}

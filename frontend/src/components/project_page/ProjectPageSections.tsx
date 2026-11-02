import { useState } from 'react';
import { ArrowLeft, Github, Globe } from 'lucide-react';

import type { ProjectEntity } from '@/api';
import PersonCard from '@/components/about/PersonCard';
import ApplyLink from '@/components/apply/ApplyLink';
import h4iLogo from '@/components/assets/h4i_files/h4i_logo.svg?url';
import OurWorkProjectLibrary from '@/components/our_work/OurWorkProjectLibrary';
import {
  buildProjectPageViewModel,
  type ProjectApiItem,
} from '@/components/project_page/projectPageMapper';
import { groupTeamMembers, type TeamMemberView } from '@/components/project_page/projectTeam';
import CTASection from '@/components/home/CTASection';
import { darkPrimaryButton, darkSecondaryButton } from '@/components/shared/buttonStyles';
import PageHero from '@/components/shared/PageHero';
import ProjectScreenshot from '@/components/project_page/ProjectScreenshot';
import { defaultHomeContent } from '@/content-schema/home';

function TeamSection({ title, members }: { title: string; members: TeamMemberView[] }) {
  if (members.length === 0) return null;
  const headingId = `team-${title.toLowerCase().replace(/\W+/g, '-')}`;

  return (
    <section aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="mb-6 border-t border-black/10 pt-5 font-heading text-2xl font-normal tracking-tight text-foreground"
      >
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6">
        {members.map((member) => (
          <PersonCard
            key={member.id}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            showPrimaryPlaceholderWhenNoLink={false}
          />
        ))}
      </div>
    </section>
  );
}

// Project images are mostly small logos: show them at no more than natural
// size on a white panel, like the project cards.
function ProjectVisual({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white ring-1 ring-black/10">
      {hasError ? (
        <img src={h4iLogo} alt="" className="absolute inset-0 m-auto w-40 max-w-[60%] opacity-40" />
      ) : (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 m-auto h-auto max-h-[70%] w-auto max-w-[70%] object-contain"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

interface ProjectPageSectionsProps {
  /** Resolved from the slug at build time by getStaticPaths. */
  project: ProjectApiItem;
  /** Every project, for the related-projects strip. */
  allProjects: ProjectEntity[];
}

export default function ProjectPageSections({
  project,
  allProjects,
}: ProjectPageSectionsProps) {
  const viewModel = buildProjectPageViewModel(project);
  const teamGroups = groupTeamMembers(viewModel.members, viewModel.title);
  const hasTeam = Object.values(teamGroups).some((members) => members.length > 0);

  const facts = [
    viewModel.partnerName ? { label: 'Partner', value: viewModel.partnerName } : null,
    viewModel.seasonLabel ? { label: 'Season', value: viewModel.seasonLabel } : null,
    viewModel.isCurrentProject ? { label: 'Status', value: 'Current project' } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <main className="bg-white">
      <PageHero
        title={viewModel.title}
        headingId="project-title"
        aside={
          viewModel.screenshot ? (
            <ProjectScreenshot
              src={viewModel.screenshot.src}
              alt={viewModel.screenshot.alt}
              url={viewModel.hostedProjectURL}
            />
          ) : undefined
        }
        leading={
          <a
            href="/ourwork"
            className="inline-flex items-center gap-2 rounded-sm font-body text-base text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-h4i-navy"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </a>
        }
      >
        {viewModel.summary ? (
          <p className="mt-6 font-body text-lg leading-relaxed text-white/90 sm:text-xl">{viewModel.summary}</p>
        ) : null}
        {facts.length > 0 ? (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-body text-sm text-white/60">{fact.label}</dt>
                <dd className="mt-1 font-heading text-lg text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {viewModel.hostedProjectURL || viewModel.repoURL ? (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
            {viewModel.hostedProjectURL ? (
              <ApplyLink href={viewModel.hostedProjectURL} className={`${darkPrimaryButton} gap-2`}>
                <Globe className="h-4 w-4" aria-hidden="true" />
                View project
              </ApplyLink>
            ) : null}
            {viewModel.repoURL ? (
              <ApplyLink href={viewModel.repoURL} className={`${darkSecondaryButton} gap-2`}>
                <Github className="h-4 w-4" aria-hidden="true" />
                View code
              </ApplyLink>
            ) : null}
          </div>
        ) : null}
      </PageHero>

      {viewModel.overviewParagraphs.length > 0 || viewModel.heroImageSrc ? (
        <section className="px-6 py-16 sm:px-8 lg:px-24 lg:py-24" aria-labelledby="project-overview">
          <div className="mx-auto grid max-w-[1248px] items-start gap-10 lg:grid-cols-12 lg:gap-16">
            {viewModel.overviewParagraphs.length > 0 ? (
              <div className="lg:col-span-7">
                <h2 id="project-overview" className="text-section text-foreground">
                  Project overview
                </h2>
                <div className="mt-6 max-w-prose space-y-5">
                  {viewModel.overviewParagraphs.map((paragraph, index) => (
                    <p key={`${index}-${paragraph}`} className="font-body text-lg leading-relaxed text-text-secondary">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <h2 id="project-overview" className="sr-only">
                Project preview
              </h2>
            )}
            {viewModel.heroImageSrc ? (
              <div className={viewModel.overviewParagraphs.length > 0 ? 'lg:col-span-5 lg:sticky lg:top-28' : 'lg:col-span-6'}>
                <ProjectVisual src={viewModel.heroImageSrc} alt={viewModel.heroImageAlt} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {hasTeam ? (
        <section className="bg-[#F1F3F5] px-6 py-16 sm:px-8 lg:px-24 lg:py-24" aria-labelledby="project-team">
          <div className="mx-auto max-w-[1248px] space-y-12">
            <h2 id="project-team" className="text-section text-foreground">
              Meet the team
            </h2>
            <TeamSection title="Product & design" members={teamGroups.productDesign} />
            <TeamSection title="Engineering" members={teamGroups.engineering} />
            <TeamSection title="Other contributors" members={teamGroups.other} />
          </div>
        </section>
      ) : null}

      <section className="px-6 py-16 sm:px-8 lg:px-24 lg:py-24">
        <div className="mx-auto max-w-[1248px]">
          <OurWorkProjectLibrary
            projects={allProjects}
            mode="related"
            excludePath={viewModel.path}
            limit={2}
            title="More of our work"
          />
        </div>
      </section>

      {/* Same closing invitation as the rest of the site. */}
      <CTASection content={defaultHomeContent.cta} />
    </main>
  );
}

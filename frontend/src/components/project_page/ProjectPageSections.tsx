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
import { Button } from '@/components/ui/button';

function TeamSection({ title, members }: { title: string; members: TeamMemberView[] }) {
  if (members.length === 0) return null;

  return (
    <section aria-labelledby={`team-${title.toLowerCase().replace(/\W+/g, '-')}`}>
      <h3
        id={`team-${title.toLowerCase().replace(/\W+/g, '-')}`}
        className="mb-6 font-heading text-h3 font-bold text-foreground"
      >
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10">
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

function ProjectVisual({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-muted p-12">
        <img src={h4iLogo} alt="" className="w-40 max-w-full opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-auto max-h-[640px] w-full rounded-xl object-contain"
      onError={() => setHasError(true)}
    />
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

  return (
    <main className="bg-background">
      <section className="bg-h4i-blue px-6 py-12 text-white lg:px-16 lg:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <a
            href="/ourwork"
            className="mb-7 inline-flex items-center gap-2 text-body-small text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </a>
          <h1 className="font-heading text-h1 font-bold text-white sm:text-display">{viewModel.title}</h1>
          {viewModel.summary ? (
            <p className="mx-auto mt-3 max-w-4xl font-body text-body-small text-white/90 sm:text-body">
              {viewModel.summary}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {viewModel.partnerName ? (
              <span className="rounded-lg bg-white/10 px-4 py-2 font-heading text-label text-white">
                {viewModel.partnerName}
              </span>
            ) : null}
            {viewModel.isCurrentProject ? (
              <span className="rounded-lg border border-white/40 px-4 py-2 font-heading text-label text-white">
                Current project
              </span>
            ) : null}
            {viewModel.seasonLabel ? (
              <span className="rounded-lg border border-white/40 px-4 py-2 font-heading text-label text-white">
                {viewModel.seasonLabel}
              </span>
            ) : null}
            {viewModel.hostedProjectURL ? (
              <Button
                asChild
                variant="secondary"
                className="h-10 bg-white text-h4i-blue hover:bg-white/90"
              >
                <ApplyLink href={viewModel.hostedProjectURL}>
                  <span className="inline-flex items-center gap-2">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    View project
                  </span>
                </ApplyLink>
              </Button>
            ) : null}
            {viewModel.repoURL ? (
              <Button
                asChild
                variant="outline"
                className="h-10 border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <ApplyLink href={viewModel.repoURL}>
                  <span className="inline-flex items-center gap-2">
                    <Github className="h-4 w-4" aria-hidden="true" />
                    View code
                  </span>
                </ApplyLink>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {viewModel.overviewParagraphs.length > 0 || viewModel.heroImageSrc ? (
        <section className="px-6 py-16 lg:px-16 lg:py-20" aria-labelledby="project-overview">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {viewModel.overviewParagraphs.length > 0 ? (
              <div>
                <h2 id="project-overview" className="font-heading text-h2 font-bold text-foreground">
                  Project Overview
                </h2>
                <div className="mt-5 space-y-4">
                  {viewModel.overviewParagraphs.map((paragraph, index) => (
                    <p
                      key={`${index}-${paragraph}`}
                      className="font-body text-body-small text-muted-foreground sm:text-body"
                    >
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
              <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
                <ProjectVisual src={viewModel.heroImageSrc} alt={viewModel.heroImageAlt} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {hasTeam ? (
        <section className="bg-card px-6 py-16 lg:px-16 lg:py-20" aria-labelledby="project-team">
          <div className="mx-auto max-w-7xl space-y-12">
            <h2 id="project-team" className="text-center font-heading text-h2 font-bold text-foreground">
              Meet the Team
            </h2>
            <TeamSection title="Product & Design" members={teamGroups.productDesign} />
            <TeamSection title="Engineering" members={teamGroups.engineering} />
            <TeamSection title="Other Contributors" members={teamGroups.other} />
          </div>
        </section>
      ) : null}

      <section className="px-6 py-16 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <OurWorkProjectLibrary
            projects={allProjects}
            mode="related"
            excludePath={viewModel.path}
            limit={2}
            title="View More of Our Work"
          />
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-16 lg:pb-20">
        <div className="mx-auto max-w-7xl rounded-xl border border-border bg-card px-6 py-10 shadow-sm sm:px-8">
          <h2 className="font-heading text-h2 font-bold text-foreground">Ready to Work with Us?</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild>
              <a href="/apply/nonprofit">Apply as a Nonprofit</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-h4i-blue text-h4i-blue hover:bg-accent hover:text-h4i-blue"
            >
              <a href="/apply/student">I’m a Student</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}


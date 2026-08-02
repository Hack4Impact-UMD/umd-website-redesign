import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Github, Globe } from 'lucide-react';

import { getProjects } from '@/api';
import PersonCard from '@/components/about/PersonCard';
import ApplyLink from '@/components/apply/ApplyLink';
import h4iLogo from '@/components/assets/h4i_files/h4i_logo.svg';
import LoadingSpinner from '@/components/LoadingSpinner';
import OurWorkProjectLibrary from '@/components/our_work/OurWorkProjectLibrary';
import {
  buildProjectPageViewModel,
  type ProjectApiItem,
  type ProjectMember,
} from '@/components/project_page/projectPageMapper';
import { AsyncError } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useApiResource } from '@/hooks';

const PRODUCT_DESIGN_ROLES = new Set(['Product Manager', 'Designer']);
const ENGINEERING_ROLES = new Set(['Tech Lead', 'Engineer', 'Bootcamp']);

const ROLE_PRIORITY: Record<string, number> = {
  'Product Manager': 0,
  Designer: 1,
  'Tech Lead': 2,
  Engineer: 3,
  Bootcamp: 4,
};

type TeamMemberView = {
  id: string;
  name: string;
  role: string;
  imageSrc: string | null;
};

const normalize = (value?: string) => value?.trim().toLowerCase() || '';

export function resolveProjectRole(member: ProjectMember, projectTitle: string): string | null {
  const roles = member.attributes.componentRolesArr;
  const projectKey = normalize(projectTitle);
  const matchingRole = roles.find((role) => normalize(role.team) === projectKey);

  if (matchingRole) return matchingRole.title;
  return roles.length === 1 ? roles[0].title : null;
}

const sortTeamMembers = (members: TeamMemberView[]) =>
  [...members].sort((a, b) => {
    const roleOrder = (ROLE_PRIORITY[a.role] ?? 99) - (ROLE_PRIORITY[b.role] ?? 99);
    return roleOrder || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  });

export function groupTeamMembers(members: ProjectMember[], projectTitle: string) {
  const groups = {
    productDesign: [] as TeamMemberView[],
    engineering: [] as TeamMemberView[],
    other: [] as TeamMemberView[],
  };

  members.forEach((member) => {
    const role = resolveProjectRole(member, projectTitle);
    if (!role) return;

    const name = `${member.attributes.firstName} ${member.attributes.lastName}`.trim();
    const teamMember = {
      id: member.id,
      name,
      role,
      imageSrc: member.attributes.avatar.data?.attributes.url || null,
    };

    if (PRODUCT_DESIGN_ROLES.has(role)) groups.productDesign.push(teamMember);
    else if (ENGINEERING_ROLES.has(role)) groups.engineering.push(teamMember);
    else groups.other.push(teamMember);
  });

  return {
    productDesign: sortTeamMembers(groups.productDesign),
    engineering: sortTeamMembers(groups.engineering),
    other: sortTeamMembers(groups.other),
  };
}

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

function ProjectPage() {
  const { projectpath } = useParams<{ projectpath: string }>();
  const slug = projectpath || '';
  const projectRes = useApiResource(
    (signal) => getProjects({ filter: { kind: 'path', value: slug }, signal }),
    [slug],
  );

  if (projectRes.status === 'loading') return <LoadingSpinner text="Loading project..." />;

  if (projectRes.status === 'error') {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <AsyncError message="This project could not be loaded." onRetry={projectRes.retry} />
      </main>
    );
  }

  const project: ProjectApiItem | undefined = projectRes.data?.[0];

  if (!project) {
    return (
      <main className="bg-background px-6 py-20 lg:px-16">
        <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10">
          <h1 className="font-heading text-h2 font-bold text-foreground">Project not found</h1>
          <p className="mt-4 font-body text-body-small text-muted-foreground">
            We could not find a project at this route.
          </p>
          <Button asChild className="mt-6">
            <Link to="/ourwork">Back to Our Work</Link>
          </Button>
        </section>
      </main>
    );
  }

  const viewModel = buildProjectPageViewModel(project);
  const teamGroups = groupTeamMembers(viewModel.members, viewModel.title);
  const hasTeam = Object.values(teamGroups).some((members) => members.length > 0);

  return (
    <main className="bg-background">
      <section className="bg-h4i-blue px-6 py-12 text-white lg:px-16 lg:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <Link
            to="/ourwork"
            className="mb-7 inline-flex items-center gap-2 text-body-small text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </Link>
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
            mode="related"
            excludePath={viewModel.path || slug}
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
              <Link to="/apply/nonprofit">Apply as a Nonprofit</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-h4i-blue text-h4i-blue hover:bg-accent hover:text-h4i-blue"
            >
              <Link to="/apply/student">I’m a Student</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProjectPage;

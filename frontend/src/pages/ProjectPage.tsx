import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Code2,
  Database,
  Github,
  Globe,
  Layers3,
  Quote,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import ApplyLink from '@/components/apply/ApplyLink';
import PersonCard from '@/components/about/PersonCard';
import { useAxios } from '@/components/HelperFunctions';
import LoadingSpinner from '@/components/LoadingSpinner';
import OurWorkProjectLibrary from '@/components/our_work/OurWorkProjectLibrary';
import { Button } from '@/components/ui/button';
import {
  PROJECT_PAGE_OVERRIDES,
  type TechIconKey,
} from '@/components/project_page/projectPageContent';
import {
  buildProjectPageViewModel,
  type ProjectApiItem,
  type ProjectMember,
} from '@/components/project_page/projectPageMapper';

const PRODUCT_DESIGN_ROLES = ['Product Manager', 'Designer'] as const;
const ENGINEERING_ROLES = ['Tech Lead', 'Engineer', 'Bootcamp'] as const;

const PRODUCT_DESIGN_PRIORITY: Record<string, number> = {
  'Product Manager': 0,
  Designer: 1,
};

const ENGINEERING_PRIORITY: Record<string, number> = {
  'Tech Lead': 0,
  Engineer: 1,
  Bootcamp: 2,
};

const TECH_ICON_MAP: Record<TechIconKey, LucideIcon> = {
  code: Code2,
  database: Database,
  layers: Layers3,
  shield: ShieldCheck,
  rocket: Rocket,
};

type TeamMemberView = {
  id: number;
  name: string;
  role: string;
  imageSrc: string | null;
};

const normalize = (value?: string) => value?.trim().toLowerCase() || '';

function resolveProjectRole(member: ProjectMember, projectTitle: string): string | null {
  const roles = member.attributes?.componentRolesArr || [];
  const projectKey = normalize(projectTitle);
  const teamRole = roles.find((role) => normalize(role.team) === projectKey);

  return teamRole?.title || null;
}

function sortByRoleThenName(
  members: TeamMemberView[],
  priority: Record<string, number>,
): TeamMemberView[] {
  return [...members].sort((a, b) => {
    const aPriority = priority[a.role] ?? 99;
    const bPriority = priority[b.role] ?? 99;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return a.name.localeCompare(b.name);
  });
}

function groupTeamMembers(members: ProjectMember[], projectTitle: string) {
  const productDesign: TeamMemberView[] = [];
  const engineering: TeamMemberView[] = [];

  members.forEach((member) => {
    const role = resolveProjectRole(member, projectTitle);

    if (!role) {
      return;
    }

    const name = `${member.attributes?.firstName || ''} ${member.attributes?.lastName || ''}`.trim();
    const teamMember: TeamMemberView = {
      id: member.id,
      name: name || 'Team Member',
      role,
      imageSrc: member.attributes?.avatar?.data?.attributes?.url || null,
    };

    if (PRODUCT_DESIGN_ROLES.includes(role as (typeof PRODUCT_DESIGN_ROLES)[number])) {
      productDesign.push(teamMember);
      return;
    }

    if (ENGINEERING_ROLES.includes(role as (typeof ENGINEERING_ROLES)[number])) {
      engineering.push(teamMember);
      return;
    }

    engineering.push(teamMember);
  });

  return {
    productDesign: sortByRoleThenName(productDesign, PRODUCT_DESIGN_PRIORITY),
    engineering: sortByRoleThenName(engineering, ENGINEERING_PRIORITY),
  };
}

function TeamSection({
  title,
  members,
}: {
  title: string;
  members: TeamMemberView[];
}) {
  if (members.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h3 className="font-heading text-h3 font-bold text-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {members.map((member) => (
          <PersonCard
            key={member.id}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            // TODO: Replace visual-only social icon placeholders with real member social URLs once available.
            showSecondaryPlaceholderIcon
          />
        ))}
      </div>
    </section>
  );
}

function ProjectPage() {
  const { projectpath } = useParams<{ projectpath: string }>();
  const slug = projectpath || '';

  const projectRes = useAxios(
    // TODO: Expand this query to include project page section fields when the backend schema is extended.
    `${import.meta.env.VITE_ROOT_URL}/api/projects?fields[0]=title&fields[1]=path&fields[2]=startDate&fields[3]=summary&fields[4]=blurb&fields[5]=repoURL&fields[6]=hostedProjectURL&fields[7]=imageAltText&populate[image][fields][0]=url&populate[members][fields][0]=firstName&populate[members][fields][1]=lastName&populate[members][fields][2]=pronouns&populate[members][populate][componentRolesArr][fields][0]=title&populate[members][populate][componentRolesArr][fields][1]=isDisplayRole&populate[members][populate][componentRolesArr][fields][2]=team&populate[members][populate][avatar][fields][0]=url&filters[path][$eq]=${encodeURIComponent(
      slug,
    )}`,
    'GET',
    {},
  );

  if (!projectRes.loaded) {
    return <LoadingSpinner text="Loading project..." />;
  }

  const apiResponse = projectRes.data as { data?: ProjectApiItem[] } | null;
  const project = apiResponse?.data?.[0];

  if (!project) {
    return (
      <main className="bg-background px-6 py-20 lg:px-16">
        <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10">
          <h1 className="font-heading text-h2 font-bold text-foreground">Project not found</h1>
          <p className="mt-4 font-body text-body-small text-muted-foreground">
            We could not find a project at this route.
          </p>
          <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-state-primary-hover">
            <Link to="/ourwork">Back to Our Work</Link>
          </Button>
        </section>
      </main>
    );
  }

  const projectPath = project.attributes?.path || slug;
  const staticOverride = PROJECT_PAGE_OVERRIDES[projectPath];
  const viewModel = buildProjectPageViewModel(project, staticOverride);
  const teamGroups = groupTeamMembers(viewModel.members, viewModel.title);

  return (
    <main className="bg-background">
      <section className="bg-primary px-6 py-14 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-6xl text-center text-primary-foreground">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">{viewModel.title}</h1>
          <p className="mx-auto mt-4 max-w-3xl font-body text-body-small text-primary-foreground/90 sm:text-body">
            {viewModel.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {viewModel.seasonLabel ? (
              <span className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2 text-caption text-primary-foreground">
                {viewModel.seasonLabel}
              </span>
            ) : null}
            {viewModel.repoURL ? (
              <Button
                asChild
                variant="secondary"
                className="h-9 bg-secondary text-secondary-foreground hover:bg-state-secondary-hover"
              >
                <ApplyLink href={viewModel.repoURL}>
                  <span className="inline-flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </span>
                </ApplyLink>
              </Button>
            ) : null}
            {viewModel.hostedProjectURL ? (
              <Button
                asChild
                variant="secondary"
                className="h-9 bg-secondary text-secondary-foreground hover:bg-state-secondary-hover"
              >
                <ApplyLink href={viewModel.hostedProjectURL}>
                  <span className="inline-flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Live Site
                  </span>
                </ApplyLink>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-h3 font-bold text-foreground">{viewModel.aboutHeading}</h2>
            {viewModel.aboutParagraphs.map((paragraph) => (
              <p key={paragraph} className="font-body text-body-small text-muted-foreground sm:text-body">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="rounded-2xl bg-muted p-6 sm:p-8">
            <h2 className="font-heading text-h3 font-bold text-foreground">{viewModel.problemHeading}</h2>
            <div className="mt-5 space-y-4">
              {viewModel.problemCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-border bg-card px-4 py-4">
                  <h3 className="font-heading text-label text-foreground">{card.title}</h3>
                  <p className="mt-2 font-body text-caption text-muted-foreground sm:text-body-small">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 pb-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-h2 font-bold text-foreground">{viewModel.solutionHeading}</h2>
            <p className="mt-4 font-body text-body-small text-muted-foreground sm:text-body">
              {viewModel.solutionSubheading}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {viewModel.solutionCards.map((card) => (
              <article key={card.title} className="rounded-xl border border-border bg-card px-4 py-5 shadow-sm">
                <h3 className="font-heading text-label text-foreground">{card.title}</h3>
                <p className="mt-2 font-body text-caption text-muted-foreground sm:text-body-small">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <img
              src={viewModel.heroImageSrc || viewModel.solutionScreenshotSrc}
              alt={viewModel.heroImageAlt || viewModel.solutionScreenshotAlt}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-heading text-h2 font-bold text-foreground">{viewModel.featuresHeading}</h2>
          <div className="mt-10 space-y-14">
            {viewModel.features.map((feature, index) => {
              const textBlock = (
                <div className="space-y-4">
                  <h3 className="font-heading text-h3 font-bold text-foreground">{feature.title}</h3>
                  {feature.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="font-body text-body-small text-muted-foreground sm:text-body">
                      {paragraph}
                    </p>
                  ))}
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 font-body text-body-small text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );

              const mediaBlock = (
                <div className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
                  <img
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="h-auto w-full rounded-xl object-cover"
                  />
                </div>
              );

              return (
                <article key={feature.title} className="grid items-center gap-8 lg:grid-cols-2">
                  {index % 2 === 0 ? (
                    <>
                      {textBlock}
                      {mediaBlock}
                    </>
                  ) : (
                    <>
                      {mediaBlock}
                      {textBlock}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-heading text-h2 font-bold text-primary-foreground">{viewModel.impactHeading}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {viewModel.metrics.map((metric) => (
              <article key={metric.label} className="rounded-xl bg-primary-foreground/10 px-4 py-5 text-center">
                <p className="font-heading text-h2 font-bold text-primary-foreground">{metric.value}</p>
                <p className="mt-1 font-body text-body-small text-primary-foreground/90">{metric.label}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            {viewModel.testimonials.map((testimonial) => (
              <article key={testimonial.quote} className="rounded-2xl bg-card px-5 py-6 text-foreground shadow-sm sm:px-6">
                <Quote className="h-5 w-5 text-primary" />
                <p className="mt-3 font-body text-body-small text-muted-foreground sm:text-body">{testimonial.quote}</p>
                <p className="mt-4 font-heading text-label text-foreground">{testimonial.name}</p>
                <p className="font-body text-caption text-muted-foreground">{testimonial.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-heading text-h3 font-bold text-foreground">{viewModel.techHeading}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {viewModel.techStack.map((tech) => {
              const Icon = TECH_ICON_MAP[tech.iconKey];

              return (
                <article
                  key={tech.label}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-4 py-5 text-center"
                >
                  <div className="rounded-full bg-accent p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-heading text-label text-foreground">{tech.label}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-6xl space-y-10">
          <h2 className="text-center font-heading text-h2 font-bold text-foreground">{viewModel.teamHeading}</h2>
          {viewModel.teamPhotoSrc ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
              <img
                src={viewModel.teamPhotoSrc}
                alt={viewModel.teamPhotoAlt || 'Project team photo'}
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>
          ) : null}
          <TeamSection title="Product & Design" members={teamGroups.productDesign} />
          <TeamSection title="Engineering" members={teamGroups.engineering} />
          {teamGroups.productDesign.length === 0 && teamGroups.engineering.length === 0 ? (
            <p className="text-center font-body text-body-small text-muted-foreground">
              Team member details are not available yet. Please check back soon.
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-background px-6 pb-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <OurWorkProjectLibrary
            mode="related"
            excludePath={viewModel.path || slug}
            limit={2}
            title={viewModel.relatedWorkHeading}
          />
        </div>
      </section>

      <section className="bg-background px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card px-6 py-10 shadow-sm sm:px-8">
          <h2 className="font-heading text-h2 font-bold text-foreground">{viewModel.ctaHeading}</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-state-primary-hover active:bg-state-primary-active">
              <ApplyLink href={viewModel.ctaPrimaryHref}>{viewModel.ctaPrimaryLabel}</ApplyLink>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-accent hover:text-primary"
            >
              <ApplyLink href={viewModel.ctaSecondaryHref}>{viewModel.ctaSecondaryLabel}</ApplyLink>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProjectPage;

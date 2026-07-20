import { Link } from 'react-router-dom';
import { getProjects, type ProjectEntity } from '@/api';
import { useApiResource } from '@/hooks';
import { resolveMediaUrl } from '@/lib/media';
import { formatSeason } from '@/lib/date';
import LoadingSpinner from '../LoadingSpinner';
import { AsyncError } from '../shared';
import styles from '../../styles/our_work/OurWorkProjectLibrary.module.css';
import h4iLogo from '../assets/h4i_files/h4i_logo.svg';

type ProjectItem = {
  title: string;
  path: string;
  startDate?: string;
  imageUrl?: string;
  imageAltText?: string;
  partnerName?: string;
  isCurrentProject: boolean;
};

type ProjectLibraryMode = 'library' | 'related';

interface OurWorkProjectLibraryProps {
  mode?: ProjectLibraryMode;
  excludePath?: string;
  limit?: number;
  title?: string;
}

export const getProjectYear = (startDate?: string) => {
  if (!startDate || !/^\d{4}/.test(startDate)) {
    return 'Unknown';
  }

  return startDate.substring(0, 4);
};

export const mapProject = (rawProject: ProjectEntity): ProjectItem => {
  const attributes = rawProject.attributes;
  const cmsImage = attributes.image.data[0]?.attributes.url;

  return {
    title: attributes.title,
    path: attributes.path,
    startDate: attributes.startDate,
    imageUrl: resolveMediaUrl(cmsImage) || undefined,
    imageAltText: attributes.imageAltText,
    partnerName: attributes.nonprofit?.data?.attributes.name,
    isCurrentProject: attributes.isCurrentProject,
  };
};

const sortYears = (a: string, b: string) => {
  if (a === 'Unknown') {
    return 1;
  }

  if (b === 'Unknown') {
    return -1;
  }

  return Number(b) - Number(a);
};

export const sortProjects = (a: ProjectItem, b: ProjectItem) => {
  if (a.isCurrentProject !== b.isCurrentProject) {
    return a.isCurrentProject ? -1 : 1;
  }

  const parsedADate = a.startDate ? Date.parse(a.startDate) : 0;
  const parsedBDate = b.startDate ? Date.parse(b.startDate) : 0;
  const aDate = Number.isFinite(parsedADate) ? parsedADate : 0;
  const bDate = Number.isFinite(parsedBDate) ? parsedBDate : 0;

  if (aDate !== bDate) return bDate - aDate;
  const titleOrder = a.title.localeCompare(b.title);
  return titleOrder || a.path.localeCompare(b.path);
};

const OurWorkProjectLibrary = ({
  mode = 'library',
  excludePath,
  limit,
  title,
}: OurWorkProjectLibraryProps) => {
  const shellClassName = mode === 'related' ? styles.relatedShell : styles.sectionShell;

  const projectsRes = useApiResource((signal) => getProjects({ signal }), []);

  if (projectsRes.status === 'loading') {
    return (
      <section className={shellClassName}>
        {mode === 'related' ? (
          <h2 className={styles.relatedHeading}>{title || 'View More of Our Work'}</h2>
        ) : null}
        <LoadingSpinner text="Loading projects..." />
      </section>
    );
  }

  if (projectsRes.status === 'error') {
    return (
      <section className={shellClassName}>
        {mode === 'related' ? (
          <h2 className={styles.relatedHeading}>{title || 'View More of Our Work'}</h2>
        ) : null}
        <AsyncError message="Projects are unavailable right now." onRetry={projectsRes.retry} />
      </section>
    );
  }

  const projects = projectsRes.data ?? [];

  const normalized = projects.map(mapProject);
  const pastProjects = normalized.filter((project) => !project.isCurrentProject);

  if ((mode === 'library' ? pastProjects : normalized).length === 0) {
    return (
      <section className={shellClassName}>
        {mode === 'related' ? (
          <h2 className={styles.relatedHeading}>{title || 'View More of Our Work'}</h2>
        ) : null}
        <p className={styles.emptyState}>
          {mode === 'related'
            ? 'No additional projects are available right now.'
            : 'No past projects are available right now. Please check back soon.'}
        </p>
      </section>
    );
  }

  const renderProjectCard = (project: ProjectItem) => {
    const metadata = project.isCurrentProject
      ? 'Current project'
      : project.partnerName || formatSeason(project.startDate);

    return (
      <article
        key={project.path}
        className={mode === 'related' ? `${styles.card} ${styles.relatedCard}` : styles.card}
      >
        <div className={styles.imagePanel}>
          {project.imageUrl ? (
            <img
              className={styles.projectImage}
              src={project.imageUrl}
              alt={project.imageAltText || `${project.title} project preview`}
            />
          ) : (
            <div className={styles.imageFallback} aria-label="Project image unavailable">
              <img src={h4iLogo} alt="" />
            </div>
          )}
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.contentWrap}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            {metadata ? <p className={styles.projectSubtitle}>{metadata}</p> : null}
          </div>
          <Link
            className={styles.arrowButton}
            to={`/ourwork/${project.path}`}
            aria-label={`Open ${project.title}`}
          >
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    );
  };

  if (mode === 'related') {
    const filtered = normalized
      .filter((project) => (excludePath ? project.path !== excludePath : true))
      .sort(sortProjects);
    const limited =
      typeof limit === 'number' ? filtered.slice(0, Math.max(limit, 0)) : filtered;

    return (
      <section className={styles.relatedShell}>
        <h2 className={styles.relatedHeading}>{title || 'View More of Our Work'}</h2>
        {limited.length === 0 ? (
          <p className={styles.emptyState}>No additional projects are available right now.</p>
        ) : (
          <div className={`${styles.grid} ${styles.relatedGrid}`}>
            {limited.map(renderProjectCard)}
          </div>
        )}
      </section>
    );
  }

  const grouped = pastProjects
    .sort(sortProjects)
    .reduce((groups: Record<string, ProjectItem[]>, project) => {
      const year = getProjectYear(project.startDate);
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(project);
      return groups;
    }, {});

  const years = Object.keys(grouped).sort(sortYears);

  return (
    <div className={styles.sectionShell}>
      {years.map((year) => (
        <section key={year} className={styles.yearSection}>
          <h2 className={styles.yearHeading}>{year} Projects</h2>
          <div className={styles.grid}>{grouped[year].map(renderProjectCard)}</div>
        </section>
      ))}
    </div>
  );
};

export default OurWorkProjectLibrary;

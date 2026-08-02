import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import styles from '../../styles/projects/Projects.module.css';
import { getProjects } from '@/api';
import { useApiResource } from '@/hooks';
import { formatSeason } from '@/lib/date';
import { resolveMediaUrl } from '@/lib/media';
import StandardButton from '../buttons/StandardButton';
import LoadingSpinner from '../LoadingSpinner';
import { AsyncError } from '../shared';

interface ProjectsProps {
  isFeatured: boolean;
  containerClassName?: string;
  showSectionTitle?: boolean;
}

const Projects = ({ isFeatured, containerClassName, showSectionTitle = true }: ProjectsProps) => {
  const res = useApiResource(
    (signal) =>
      getProjects({
        filter: isFeatured
          ? { kind: 'featured', value: true }
          : { kind: 'current', value: true },
        signal,
      }),
    [isFeatured],
  );

  const projects = res.data ?? [];

  return (
    <div>
      <div className={[styles.featuredProjectCards, containerClassName].filter(Boolean).join(' ')}>
        {/*if display current projects, show current projects title*/}
        {isFeatured || !showSectionTitle ? null : (
          <h2 id={styles.sectionTitle}>Current Projects</h2>
        )}
        {res.status === 'loading' ? (
          <LoadingSpinner text="Loading projects..." />
        ) : res.status === 'error' ? (
          <AsyncError message="Projects are unavailable right now." onRetry={res.retry} />
        ) : !projects || projects.length === 0 ? (
          <NoProjects />
        ) : (
          projects.map((item) => {
              const fullDate = formatSeason(item.attributes.startDate);
              return (
                <FeaturedProjectCard
                  key={item.id}
                  link={'ourwork/' + item.attributes.path}
                  title={item.attributes.title}
                  date={fullDate}
                  summary={item.attributes.summary}
                  image={
                    item.attributes.image.data[0]
                      ? resolveMediaUrl(item.attributes.image.data[0].attributes.url)
                      : 'https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png'
                  }
                  altText={item.attributes.imageAltText ?? `${item.attributes.title} project preview`}
                />
              );
            })
        )}
      </div>
      {/**display see more button if showing featured projects */}
      {isFeatured ? (
        <div className={styles.seeMore}>
          <StandardButton text="See More" color="blue" link="/ourwork" />
        </div>
      ) : null}
    </div>
  );
};

const NoProjects = () => {
  return <h1>Oops! There are currently no projects loaded. Try again later.</h1>;
};

export default Projects;

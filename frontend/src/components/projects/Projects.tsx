import React, { useCallback } from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import styles from '../../styles/projects/Projects.module.css';
import { getSeason } from '../HelperFunctions';
import StandardButton from '../buttons/StandardButton';
import LoadingSpinner from '../LoadingSpinner';
import { getProjects } from '@/api/compat';
import { useApiData } from '@/hooks/useApiData';
import { StrapiCollectionResponse, StrapiProjectAttributes } from '@/api/types';

interface ProjectsProps {
  isFeatured: boolean;
  containerClassName?: string;
  showSectionTitle?: boolean;
}

const emptyProjectResponse: StrapiCollectionResponse<StrapiProjectAttributes> = {
  data: [],
  meta: {
    pagination: {
      page: 1,
      pageSize: 100,
      pageCount: 1,
      total: 0,
    },
  },
};

const Projects = ({ isFeatured, containerClassName, showSectionTitle = true }: ProjectsProps) => {
  const loader = useCallback(
    () =>
      getProjects({
        isFeatured: isFeatured ? true : undefined,
        isCurrentProject: isFeatured ? undefined : true,
        page: 1,
        pageSize: 100,
      }),
    [isFeatured],
  );

  const response = useApiData(loader, emptyProjectResponse);
  const projects = response.data.data || [];

  return (
    <div>
      <div className={[styles.featuredProjectCards, containerClassName].filter(Boolean).join(' ')}>
        {isFeatured || !showSectionTitle ? null : (
          <h2 id={styles.sectionTitle}>Current Projects</h2>
        )}
        {!response.loaded ? (
          <LoadingSpinner text="Loading projects..." />
        ) : !projects || projects.length === 0 ? (
          <NoProjects />
        ) : (
          projects.map((item, index: number) => {
            const startDate = item.attributes.startDate
              ? `${getSeason(Number((item.attributes.startDate as string).substring(5, 7)))} ${(item.attributes.startDate as string).substring(0, 4)}`
              : '';
            const fullDate = startDate;
            return (
              <FeaturedProjectCard
                key={index}
                link={`ourwork/${item.attributes.path}`}
                title={item.attributes.title}
                date={fullDate}
                summary={item.attributes.summary}
                image={
                  item.attributes.image?.data?.[0]?.attributes?.url ||
                  'https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png'
                }
                altText={item.attributes.imageAltText || item.attributes.title}
              />
            );
          })
        )}
      </div>
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

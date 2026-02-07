import React from 'react';
import { Link } from 'react-router-dom';
import { useAxios } from '../HelperFunctions';
import LoadingSpinner from '../LoadingSpinner';
import styles from '../../styles/our_work/OurWorkProjectLibrary.module.css';
import h4iLogo from '../assets/h4i_files/h4i_logo.svg';
import placeholderImage from '../assets/placeholder.png';
import yknotImage from '../assets/yknot_image.jpg';
import mottHavenImage from '../assets/mott_haven_image.jpg';
import twoUnstoppableImage from '../assets/2unstoppable_image.jpg';
import teamImage from '../assets/h4igroup_photo.jpg';

type RawProject = {
  attributes?: {
    title?: string;
    path?: string;
    startDate?: string;
    imageAltText?: string;
    isCurrentProject?: boolean;
    image?: {
      data?: Array<{
        attributes?: {
          url?: string;
        };
      }>;
    };
    nonprofit?: {
      data?: {
        attributes?: {
          name?: string;
        };
      };
    };
  };
};

type ProjectsApiResponse = {
  data?: RawProject[];
};

type ProjectItem = {
  title: string;
  path: string;
  startDate?: string;
  imageUrl: string;
  imageAltText?: string;
  nonprofitName: string;
  isCurrentProject: boolean;
};

const fallbackGallery = [yknotImage, mottHavenImage, twoUnstoppableImage, teamImage];

const getYear = (startDate?: string) => {
  if (!startDate || startDate.length < 4) {
    return 'Unknown';
  }

  return startDate.substring(0, 4);
};

const getProjectPhoto = (path: string, imageUrl?: string) => {
  const hasCmsImage = typeof imageUrl === 'string' && imageUrl.length > 0 && imageUrl !== placeholderImage;

  if (hasCmsImage) {
    return imageUrl;
  }

  const hash = Array.from(path).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackGallery[hash % fallbackGallery.length];
};

const mapProject = (rawProject: RawProject): ProjectItem | null => {
  const attributes = rawProject.attributes;

  if (!attributes?.title || !attributes.path) {
    return null;
  }

  const cmsImage = attributes.image?.data?.[0]?.attributes?.url;

  return {
    title: attributes.title,
    path: attributes.path,
    startDate: attributes.startDate,
    imageUrl: getProjectPhoto(attributes.path, cmsImage),
    imageAltText: attributes.imageAltText,
    nonprofitName: attributes.nonprofit?.data?.attributes?.name || 'Nonprofit Partner',
    isCurrentProject: attributes.isCurrentProject === true,
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

const OurWorkProjectLibrary = () => {
  const projectsRes = useAxios(
    `${import.meta.env.VITE_ROOT_URL}/api/projects?fields[0]=title&fields[1]=path&fields[2]=startDate&fields[3]=isCurrentProject&fields[4]=imageAltText&populate[image][fields][0]=url&populate[nonprofit][fields][0]=name`,
    'GET',
    {},
  );

  if (!projectsRes.loaded) {
    return (
      <section className={styles.sectionShell}>
        <LoadingSpinner text="Loading projects..." />
      </section>
    );
  }

  const apiResponse = projectsRes.data as ProjectsApiResponse | null;
  const projects = apiResponse?.data || [];

  const normalized = projects
    .map(mapProject)
    .filter((project): project is ProjectItem => project !== null)
    .filter((project) => !project.isCurrentProject);

  if (normalized.length === 0) {
    return (
      <section className={styles.sectionShell}>
        <p className={styles.emptyState}>No past projects are available right now. Please check back soon.</p>
      </section>
    );
  }

  const grouped = normalized.reduce((groups: Record<string, ProjectItem[]>, project) => {
    const year = getYear(project.startDate);
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
          <div className={styles.grid}>
            {grouped[year].map((project) => (
              <article key={project.path} className={styles.card}>
                <div className={styles.imagePanel}>
                  <img className={styles.badge} src={h4iLogo} alt="Hack4Impact" />
                  <img
                    className={styles.projectImage}
                    src={project.imageUrl}
                    alt={project.imageAltText || `${project.title} preview`}
                  />
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.contentWrap}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectSubtitle}>{project.nonprofitName}</p>
                  </div>
                  <Link className={styles.arrowButton} to={`/ourwork/${project.path}`} aria-label={`Open ${project.title}`}>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default OurWorkProjectLibrary;

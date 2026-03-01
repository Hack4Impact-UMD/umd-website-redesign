import React, { useCallback, useMemo, useState } from 'react';
import stylestwo from '../styles/projects/ProjectsTop.module.css';
import styles from '../styles/projects/ProjectsPage.module.css';
import githubIcon from '../components/assets/icons/github_icon.png';
import internetIcon from '../components/assets/icons/internet_icon.png';
import Person from '../components/Person';
import { useParams } from 'react-router-dom';
import { getSeason } from '../components/HelperFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import { FADE_IN_TRANSITION } from '../constants/animations';
import { getProjects } from '@/api/compat';
import { useApiData } from '@/hooks/useApiData';
import { StrapiCollectionResponse, StrapiProjectAttributes } from '@/api/types';
import { resolveMediaUrl } from '@/lib/media';

const emptyProjectResponse: StrapiCollectionResponse<StrapiProjectAttributes> = {
  data: [],
  meta: {
    pagination: {
      page: 1,
      pageSize: 1,
      pageCount: 1,
      total: 0,
    },
  },
};

function ProjectPage() {
  const params = useParams();

  const loader = useCallback(() => {
    if (!params.projectpath) {
      return Promise.resolve(emptyProjectResponse);
    }

    return getProjects({
      path: params.projectpath,
      page: 1,
      pageSize: 1,
    });
  }, [params.projectpath]);

  const response = useApiData(loader, emptyProjectResponse);
  const project = response.data.data[0] || null;

  if (!response.loaded) {
    return <LoadingSpinner text="Loading project..." />;
  }

  if (project) {
    return (
      <div className={styles.content}>
        <Header project={project} />
        <TeamMembers project={project} />
      </div>
    );
  }

  return (
    <div className={styles.studentApplyHeader}>
      <div className={styles.studentApplyHeaderContent}>
        <h1>Project not found</h1>
      </div>
    </div>
  );
}

function Header({ project }: { project: { attributes: StrapiProjectAttributes } }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const startDate =
    project.attributes.startDate
      ? `${getSeason(Number((project.attributes.startDate as string).substring(5, 7)))} ${(project.attributes.startDate as string).substring(0, 4)}`
      : '';

  const imageUrl =
    resolveMediaUrl(project.attributes.image?.data?.[0]?.attributes?.url) ||
    'https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png';

  return (
    <div className={styles.studentApplyHeader}>
      <div className={styles.studentApplyHeaderContent}>
        <header className={stylestwo.title}>{project.attributes.title}</header>
        <div className={stylestwo.projectInfoContainer}>
          <div className={stylestwo.flexChild}>
            <div className={stylestwo.projectPicture}>
              <img
                src={imageUrl}
                alt={project.attributes.title || 'Project'}
                onLoad={() => setImageLoaded(true)}
                style={{ opacity: imageLoaded ? 1 : 0, transition: FADE_IN_TRANSITION }}
              />
            </div>
          </div>
          <div className={stylestwo.flexChild}>
            <div className={stylestwo.date}> {startDate}</div>
            <p className={stylestwo.projectDescription}>
              {project.attributes.blurb || 'More information about this project is pending.'} <br />
              <br />
              {project.attributes.repoURL ? (
                <a href={project.attributes.repoURL}>
                  <img src={githubIcon} alt="GitHub Repository" />
                </a>
              ) : (
                ''
              )}{' '}
              &nbsp;
              {project.attributes.hostedProjectURL ? (
                <a href={project.attributes.hostedProjectURL}>
                  <img src={internetIcon} alt="Hosted Project" />
                </a>
              ) : (
                ''
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMembers({ project }: { project: { attributes: StrapiProjectAttributes } }) {
  const members = project.attributes.members?.data ?? [];
  const teamOrder = ['Product Manager', 'Tech Lead', 'Designer', 'Engineer'];

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const aRole = (a.attributes.componentRolesArr ?? []).find(
        (role) => role.team && role.team.trim() === project.attributes.title,
      )?.title;
      const bRole = (b.attributes.componentRolesArr ?? []).find(
        (role) => role.team && role.team.trim() === project.attributes.title,
      )?.title;

      return teamOrder.indexOf(aRole || '') - teamOrder.indexOf(bRole || '');
    });
  }, [members, project.attributes.title]);

  return (
    <div className={styles.teamMembersDiv}>
      <h2>Team Members</h2>
      <div className={styles.teamMembersPhotos}>
        {sortedMembers.length === 0
          ? 'Looks like there are no team members here. Check again later?'
          : sortedMembers.map((item, index) => {
              const memberRoles = item.attributes.componentRolesArr ?? [];
              if (memberRoles.length === 0) {
                return null;
              }

              const projectRole = memberRoles.find(
                (role) => role.team && role.team.trim() === project.attributes.title,
              );

              if (!projectRole) {
                return null;
              }

              return (
                <Person
                  key={index}
                  memberName={`${item.attributes.firstName} ${item.attributes.lastName}` || 'Member'}
                  role={projectRole.title || 'Member'}
                  pronouns={item.attributes.pronouns || undefined}
                  src={item.attributes.avatar?.data?.attributes?.url || null}
                />
              );
            })}
      </div>
    </div>
  );
}

export default ProjectPage;

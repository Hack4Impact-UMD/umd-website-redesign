import React, { useState, useEffect } from 'react';
import { PastProjectCard } from './PastProjectCard';
import styles from './PastProjects.module.css';
import { getProjects, getMembersFromProject } from '../../firebaseFunctions/FirebaseCalls';
import Project from '../../types/Project';
import { Member } from '../../types/Member';

export interface ProjectAndMembersType {
  project: Project;
  members: Member[];
}

const PastProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectAndMembersType[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await getProjects(true);
        const projectsWithMembers: ProjectAndMembersType[] = await Promise.all(
          fetchedProjects.map(async (project) => {
            const projectMembers = await getMembersFromProject(project.id);
            return {
              project: project.project,
              members: projectMembers,
            };
          })
        );

        setProjects(projectsWithMembers);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const modifiedInput = searchInput.trim().toLowerCase();

  // Filters projects based on project title, start date, link, season/year, or team member names
  const filteredData = projects.filter(({ project, members }) => {
    const teamLowercase: string[] = members.map((member) => `${member.firstName} ${member.lastName}`.toLowerCase());

    const memberMatch = teamLowercase.some((name) => name.includes(modifiedInput));

    // TODO: Fix to use actual date
    const seasonAndYear = 'Spring 2025';

    return (
      modifiedInput === '' ||
      project.title.toLowerCase().includes(modifiedInput) ||
      project.projectSemesters[0].season.toLowerCase().includes(modifiedInput) ||
      seasonAndYear.includes(modifiedInput) ||
      memberMatch
    );
  });

  return (
    <div className={styles.pastProjectsContainer}>
      <h2 id={styles.sectionTitle}>Past Projects</h2>
      <div id={styles.searchbarWrapper}>
        <input
          id={styles.searchbar}
          placeholder="Search by project, nonprofit, team member, season, or year"
          onChange={handleChange}
          value={searchInput}
          type="text"
        />
      </div>
      {filteredData.length !== 0 ? (
        <div id={styles.projectsDisplay}>
          {filteredData.map(({ project }, index) => {
            // TODO: Fix to use actual date
            const startDate = 'Spring 2025';
            const fullDate = startDate;

            return (
              <PastProjectCard
                key={index}
                link={`TODO`}
                title={project.title}
                date={fullDate}
                image={
                  project.image.downloadURL || 'https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png'
                }
                altText={project.title}
              />
            );
          })}
        </div>
      ) : (
        <div id={styles.notFound}>No results for &quot;{searchInput}&quot;</div>
      )}
    </div>
  );
};

export default PastProjects;

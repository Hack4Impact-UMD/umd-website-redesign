import { useEffect, useState } from 'react';
import { getProjects } from '../../firebaseFunctions/FirebaseCalls';
import Project from '../../types/Project';
import StandardButton from '../buttons/StandardButton';
import FeaturedProjectCard from './FeaturedProjectCard';
import styles from './Projects.module.css';

const Projects = (props: any) => {
  const seasons = {
    Spring: 1,
    Summer: 2,
    Fall: 3,
    Winter: 4,
  };
  const res = null;
  const [projects, setProjects] = useState<{ project: Project; id: string }[]>([]);

  useEffect(() => {
    getProjects(props.isFeatured).then((res) => {
      res.forEach((project: { project: Project; id: string }) => {
        project.project.projectSemesters.sort((a, b) =>
          a.year == b.year ? seasons[a.season] - seasons[b.season] : a.year - b.year,
        );
      });
      setProjects(res);
      console.log(res);
    });
  }, []);
  // fetch featuredProjects from backend

  return (
    <div>
      <div className={styles.featuredProjectCards}>
        {/*if display current projects, show current projects title*/}
        {props.isFeatured ? null : <h2 id={styles.sectionTitle}>Current Projects</h2>}
        {!projects
          ? projects
          : projects.map((proj, index) => {
              const item: Project = proj.project;
              let fullDate =
                item.projectSemesters.length > 0
                  ? item.projectSemesters[0].season + ' ' + item.projectSemesters[0].year
                  : '';
              if (item.projectSemesters.length > 1) {
                fullDate +=
                  ' - ' +
                  item.projectSemesters[item.projectSemesters.length - 1].season +
                  ' ' +
                  item.projectSemesters[item.projectSemesters.length - 1].year;
              }
              return (
                <FeaturedProjectCard
                  key={index}
                  link={'ourwork/'}
                  title={item.title}
                  date={fullDate}
                  summary={item.projectSemesters.length > 0 ? item.projectSemesters[0].summary : ''}
                  image={item.image.downloadURL}
                  altText={item.title + ' project image'}
                />
              );
            })}
      </div>
      {/**display see more button if showing featured projects */}
      {props.isFeatured ? (
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

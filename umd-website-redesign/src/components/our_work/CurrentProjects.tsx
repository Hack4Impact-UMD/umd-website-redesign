import React from 'react';
import FeaturedProjectCard from '../FeaturedProjectCard';
import { current_projects } from './current_projects';
import styles from '../../styles/our_work/CurrentProjects.module.css';

/* Note: still need to change inside to be a for loop to handle any number of current projects */
const CurrentProjects = () => {
  return (
    <div>
      <h1 id={styles.sectionTitle}>Current Projects</h1>
      <div>
        <FeaturedProjectCard
          link={current_projects[0].link}
          title={current_projects[0].title}
          date={current_projects[0].date}
          summary={current_projects[0].summary}
          image={current_projects[0].image}
          altText={current_projects[0].altText}
        />
      </div>
      <div>
        <FeaturedProjectCard
          link={current_projects[1].link}
          title={current_projects[1].title}
          date={current_projects[1].date}
          summary={current_projects[1].summary}
          image={current_projects[1].image}
          altText={current_projects[1].altText}
        />
      </div>
      <div>
        <FeaturedProjectCard
          link={current_projects[2].link}
          title={current_projects[2].title}
          date={current_projects[2].date}
          summary={current_projects[2].summary}
          image={current_projects[2].image}
          altText={current_projects[2].altText}
        />
      </div>
    </div>
  );
};

export default CurrentProjects;

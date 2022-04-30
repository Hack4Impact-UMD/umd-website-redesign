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
        {current_projects.map((item, index) => (
          <FeaturedProjectCard
            key={index}
            link={item.link}
            title={item.title}
            date={item.date}
            summary={item.summary}
            image={item.image}
            altText={item.altText}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentProjects;

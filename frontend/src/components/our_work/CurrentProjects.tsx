import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import { current_projects } from './current_projects';
import styles from '../../styles/our_work/CurrentProjects.module.css';

const CurrentProjects = () => {
  return (
    <div>
      <h1 id={styles.sectionTitle}>Current Projects</h1>
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
  );
};

export default CurrentProjects;

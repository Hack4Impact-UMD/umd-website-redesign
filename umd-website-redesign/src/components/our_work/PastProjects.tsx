import React from 'react';
import OurWorkSearchBar from './OurWorkSearchBar';
import PastProjectCard from './PastProjectCard';
import { past_projects } from './past_projects';
import styles from '../../styles/our_work/PastProjects.module.css';

const PastProjects: React.FC = () => {
  return (
    <div>
      <h1 id={styles.sectionTitle}>Past Projects</h1>
      <OurWorkSearchBar />
      <PastProjectCard
        link={past_projects[0].link}
        title={past_projects[0].title}
        date={past_projects[0].date}
        image={past_projects[0].image}
        altText={past_projects[0].altText}
      />
    </div>
  );
};

export default PastProjects;

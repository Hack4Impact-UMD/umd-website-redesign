import React from 'react';
import Projects from '../../components/projects/Projects';
import styles from './OurWork.module.css';
import OurWorkHeader from './OurWorkHeader';
import PastProjects from './PastProjects';

const OurWork: React.FC = () => {
  return (
    <div id={styles.OurWorkPage}>
      <div className={styles.content}>
        <OurWorkHeader />
        <div className={styles.currentProjects}>
          <Projects isFeatured={false} />
        </div>
        <div className={styles.pastProjects}>
          <PastProjects />
        </div>
      </div>
    </div>
  );
};

export default OurWork;

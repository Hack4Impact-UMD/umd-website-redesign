import React from 'react';
import OurWorkHeader from '../components/our_work/OurWorkHeader';
import PastProjects from '../components/our_work/PastProjects';
import Projects from '../components/projects/Projects';
import styles from '../styles/our_work/OurWork.module.css';

const OurWork: React.FC = () => {
  return (
    <div id={styles.OurWorkPage}>
      <div className={styles.content}>
        <OurWorkHeader />
        <div className={styles.currentProjects}>
          <Projects isFeatured = {false}/>
        </div>
        <div className={styles.pastProjects}>
          <PastProjects />
        </div>
      </div>
    </div>
  );
};

export default OurWork;

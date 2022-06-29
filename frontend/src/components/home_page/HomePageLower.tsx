import React from 'react';
import styles from '../../styles/home/HomePageLower.module.css';
import OblongButton from '../buttons/OblongButton';

const HomePageLower = () => {
  return (
    <div id={styles.parentContainer}>
      <div id={styles.studentsContainer}>
        <h1>Students</h1>
        <p>
          Our members consist of current University of Maryland students interested in using tech for social good. Each
          semester, members are split into teams of Product Managers, UI/UX Designers, and Engineers and partner with a
          nonprofit organization to develop a product that will help the organization.
        </p>
        <div className={styles.bluebtn}>
          <OblongButton text="Join Us" color="blue" link="/apply/student" />
        </div>
      </div>
      <div id={styles.nonprofitsContainer}>
        <h1>Nonprofits</h1>
        <p>
          Nonprofit organizations are the pillars of our community; they focus on a variety of social issues, and
          Hack4Impact-UMD focuses on helping these organizations with any of their technical needs to improve the
          effectiveness of their work.
        </p>
        <div className={styles.bluebtn}>
          <OblongButton text="Work With Us" color="blue" link="/apply/nonprofit" />
        </div>
      </div>
    </div>
  );
};

export default HomePageLower;

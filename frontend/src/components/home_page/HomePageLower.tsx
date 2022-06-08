import React from 'react';
import styles from '../../styles/home/HomePageLower.module.css';

const HomePageLower = () => {
  return (
    <div id={styles.parentContainer}>
      <div id={styles.studentsContainer}>
        <h1>Students</h1>
        <p>
          Our members consist of current University of Maryland students interested in using tech for social good. Each semester, members are split into teams of Product Managers, UI/UX Designers, and Engineers and partner with a nonprofit organization to develop a product that will help the organization.
        </p>
        <a href='/apply/student'>
          <button aria-label="Join Us" className={styles.bluebtn}>
            Join Us
          </button>
        </a>
      </div>
      <div id={styles.nonprofitsContainer}>
        <h1>Nonprofits</h1>
        <p>
          Nonprofit organizations are the pillars of our community; they focus on a variety of social issues, and Hack4Impact-UMD focuses on helping these organizations with any of their technical needs to improve the effectiveness of their work. 
        </p>
        <a href='/apply/nonprofit'>
          <button aria-label="Work With Us" className={styles.bluebtn}>
            Work With Us
          </button>
        </a>
      </div>
    </div>
  );
};

export default HomePageLower;

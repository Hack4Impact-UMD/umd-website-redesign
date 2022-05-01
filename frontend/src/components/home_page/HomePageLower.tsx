import React from 'react';
import styles from '../../styles/home/HomePageLower.module.css';

const HomePageLower = () => {
  return (
    <div id={styles.parentContainer}>
      <div id={styles.studentsContainer}>
        <h1>Students</h1>
        <p>
          Short blurb about nonprofit roles. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <a href="https://www.google.com">
          <button aria-label="Join Us" className={styles.bluebtn}>
            Join Us
          </button>
        </a>
      </div>
      <div id={styles.nonprofitsContainer}>
        <h1>Nonprofits</h1>
        <p>
          Short blurb about nonprofit roles. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <a href="https://www.google.com">
          <button aria-label="Work With Us" className={styles.bluebtn}>
            Work With Us
          </button>
        </a>
      </div>
    </div>
  );
};

export default HomePageLower;

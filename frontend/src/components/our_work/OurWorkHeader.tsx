import React from 'react';
import styles from '../../styles/our_work/OurWorkHeader.module.css';

const OurWorkHeader = () => {
  return (
    <div>
      <div id={styles.headerDiv}>
        <h1 id={styles.title}>Our Work</h1>
        <p id={styles.headerText}>
          We partner with national and local nonprofit organizations to develop products that help their technical
          needs. Our chapter focuses on web development, and in the past, we&apos;ve built websites and web applications
          for organizations such as Y-KNOT and 2Unstoppable. Check out our current and past projects!
        </p>
      </div>
    </div>
  );
};

export default OurWorkHeader;

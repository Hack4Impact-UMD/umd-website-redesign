import React from 'react';
import styles from '../../styles/our_work/OurWorkHeader.module.css';
import heroImage from '../assets/h4igroup_photo.jpg';

const OurWorkHeader = () => {
  return (
    <header className={styles.header}>
      <img className={styles.heroImage} src={heroImage} alt="Hack4Impact UMD team" />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 className={styles.title}>Past Project Library</h1>
        <p className={styles.subtitle}>Building Software for Social Good</p>
      </div>
    </header>
  );
};

export default OurWorkHeader;

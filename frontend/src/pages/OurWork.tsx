import React from 'react';
import OurWorkHeader from '../components/our_work/OurWorkHeader';
import OurWorkProjectLibrary from '../components/our_work/OurWorkProjectLibrary';
import styles from '../styles/our_work/OurWork.module.css';

const OurWork: React.FC = () => {
  return (
    <main className={styles.page}>
      <OurWorkHeader />
      <OurWorkProjectLibrary />
    </main>
  );
};

export default OurWork;

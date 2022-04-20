import React from 'react';
import OurWorkHeader from '../components/our_work/OurWorkHeader';
import CurrentProjects from '../components/our_work/CurrentProjects';
import PastProjects from '../components/our_work/PastProjects';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/our_work/OurWork.module.css';

const OurWork: React.FC = () => {
  return (
    <div>
      <div className={styles.navBarDiv}>
        <Navbar />
      </div>
      <OurWorkHeader />
      <CurrentProjects />
      <PastProjects />
      <Footer />
    </div>
  );
};

export default OurWork;

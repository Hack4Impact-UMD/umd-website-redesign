import React, { useState } from 'react';
import OurWorkHeader from '../components/our_work/OurWorkHeader';
import CurrentProjects from '../components/our_work/CurrentProjects';
import PastProjects from '../components/our_work/PastProjects';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import styles from '../styles/our_work/OurWork.module.css';
import { ReactComponent as HeaderBackground } from '../components/assets/bluewave_desktop.svg';
import ScrollToTopButton from '../components/assets/ScrollToTopButton.png';
import ScrollToTopButtonHover from '../components/assets/ScrollToTopButtonHover.png';

const OurWork: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <>
      <div className={styles.headerBackground}>
        <HeaderBackground style={{ height: '100%', width: '100%' }} />
      </div>
      <div id={styles.OurWorkPage}>
        <div className={styles.navBarDiv}>
          <Navbar />
        </div>
        <div className={styles.content}>
          <OurWorkHeader />
          <CurrentProjects />
          <PastProjects />
        </div>
        <div
          className={styles.ScrollToTopButton}
          onClick={scrollToTop}
          style={{ display: visible ? 'inline' : 'none' }}
        >
          <img src={ScrollToTopButton} aria-label="Scroll to Top Button" />
          <img
            className={styles.ScrollToTopButtonHover}
            src={ScrollToTopButtonHover}
            aria-label="Scroll to Top Button Hover"
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default OurWork;

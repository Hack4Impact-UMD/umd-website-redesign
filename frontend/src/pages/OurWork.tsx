import React, { useState } from 'react';
import OurWorkHeader from '../components/our_work/OurWorkHeader';
import CurrentProjects from '../components/our_work/CurrentProjects';
import PastProjects from '../components/our_work/PastProjects';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import styles from '../styles/our_work/OurWork.module.css';
//import { ReactComponent as HeaderBackground } from '../components/assets/bluewave_desktop.svg';
import ScrollToTopButton from '../components/assets/top of page button.jpg';

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
    <div id={styles.OurWorkPage}>
      {/*<HeaderBackground id={styles.headerBackground} />*/}
      <div className={styles.navBarDiv}>
        <Navbar />
      </div>
      <OurWorkHeader />
      <CurrentProjects />
      <PastProjects />
      <img
        id={styles.ScrollToTopButton}
        src={ScrollToTopButton}
        alt="Scroll to Top of Page"
        onClick={scrollToTop}
        style={{ display: visible ? 'inline' : 'none' }}
      />
      <Footer />
    </div>
  );
};

export default OurWork;

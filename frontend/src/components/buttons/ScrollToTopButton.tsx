import React, { useState } from 'react';
import styles from '../../styles/buttons/ScrollToTopButton.module.css';
import ScrollToTopButtonImg from '../assets/ScrollToTopButton.svg';
import ScrollToTopButtonHoverImg from '../assets/ScrollToTopButtonHover.svg';

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Controls visibility of scroll up button.
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
    <div className={styles.ScrollToTopButton} onClick={scrollToTop} style={{ display: visible ? 'inline' : 'none' }}>
      <img 
        className={styles.ScrollToTopButton}
        src={ScrollToTopButtonImg} 
        aria-label="Scroll to Top Button" 
      />
      <img
        className={styles.ScrollToTopButtonHover}
        src={ScrollToTopButtonHoverImg}
        aria-label="Scroll to Top Button Hover"
      />
    </div>
  );
};

export default ScrollToTopButton;

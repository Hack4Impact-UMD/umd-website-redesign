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
        src={ScrollToTopButtonImg} 
        aria-label="Scroll to Top Button" 
        width={window.innerWidth <= 500 ? 59 : 64} // Check if in mobile mode
        height={window.innerWidth <= 500 ? 59 : 64}/>
      <img
        className={styles.ScrollToTopButtonHover}
        src={ScrollToTopButtonHoverImg}
        aria-label="Scroll to Top Button Hover"
        width={window.innerWidth <= 500 ? 59 : 64}
        height={window.innerWidth <= 500 ? 59 : 64}
      />
    </div>
  );
};

export default ScrollToTopButton;

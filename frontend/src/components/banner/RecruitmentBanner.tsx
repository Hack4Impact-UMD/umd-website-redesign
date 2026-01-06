import React, { useState, useEffect } from 'react';
import styles from '../../styles/banner/RecruitmentBanner.module.css';

const RecruitmentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the banner has been dismissed
    const dismissed = localStorage.getItem('h4i-winter-recruitment-banner-dismissed');
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('h4i-winter-recruitment-banner-dismissed', 'true');
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerContent}>
        <span className={styles.bannerText}>
          <span className={styles.bannerEmoji}>🎉</span>
          <span className={styles.bannerMessage}>
            Winter Recruitment Cycle is now open!{' '}
            <a
              href="https://apply.umd.hack4impact.org/login"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bannerLink}
            >
              Apply to join H4I-UMD →
            </a>
          </span>
        </span>
        <button
          className={styles.closeButton}
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default RecruitmentBanner;

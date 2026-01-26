import React, { useState, useEffect } from 'react';
import styles from '../../styles/banner/RecruitmentBanner.module.css';

// Update this key each recruitment cycle (e.g., 'winter-2026', 'spring-2026')
const BANNER_STORAGE_KEY = 'h4i-recruitment-banner-dismissed-winter-2026';

const RecruitmentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the banner has been dismissed
    const dismissed = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
      // Add class to body to adjust content padding
      document.body.classList.add('recruitment-banner-visible');
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
    // Remove class from body when dismissed
    document.body.classList.remove('recruitment-banner-visible');
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.bannerContainer} ${visible ? styles.fadeIn : ''}`}>
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

import React from 'react';
import styles from '../../styles/home/Supporters.module.css';
import bloombergLogo from '../assets/supporters/Bloomberg.png';
import microsoftLogo from '../assets/supporters/Microsoft.png';
import codepathLogo from '../assets/supporters/CodePath.png';
import uberLogo from '../assets/supporters/Uber.png';
import capitalOneLogo from '../assets/supporters/CapitalOne.png';
import doGoodLogo from '../assets/supporters/DoGood.png';
import smithLogo from '../assets/supporters/SmithSchool.png';
import acesLogo from '../assets/supporters/ACES.png';
import { Link } from 'react-router-dom';

const Supporters = () => {
  return (
    <div id={styles.supportersContainer}>
      <h2>Our Supporters</h2>
      <h4 className={styles.divider}>
        <span>PLATINUM</span>
      </h4>
      <div className={styles.tierContainer}>
        <img src={microsoftLogo} alt="Microsoft Logo" className={styles.supporterLogo} />
        <img src={uberLogo} alt="Uber Logo" className={styles.supporterLogo} />
      </div>
      <h4 className={styles.divider}>
        <span>GOLD</span>
      </h4>
      <div className={styles.content}>
        <img src={codepathLogo} alt="CodePath Logo" className={styles.supporterLogo} />
        <img src={doGoodLogo} alt="DoGood Logo" className={styles.supporterLogo} />
        <img src={capitalOneLogo} alt="CapitalOne Logo" className={styles.supporterLogo} />
        <img src={smithLogo} alt="Smith School Logo" className={styles.supporterLogo} />
      </div>
      <h4 className={styles.divider}>
        <span>SILVER</span>
      </h4>
      <div className={styles.tierContainer}>
        <img src={bloombergLogo} alt="Bloomberg Logo" className={styles.supporterLogo} />
      </div>
      <h4 className={styles.divider}>
        <span>BRONZE</span>
      </h4>
      <div className={styles.tierContainer}>
        <img src={acesLogo} alt="ACES Logo" className={styles.supporterLogo} />
      </div>
      <Link className={styles.navLinks} to={'/contactus'}>
        {'Interested in partnering? Contact us!'}
      </Link>
    </div>
  );
};

export default Supporters;

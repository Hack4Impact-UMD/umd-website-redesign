import React from 'react';
import styles from '../../styles/home/Supporters.module.css';
import bloombergLogo from '../assets/supporters/Bloomberg.png';
import geicoLogo from '../assets/supporters/Geico.png';
import workdayLogo from '../assets/supporters/Workday.png';
import codepathLogo from '../assets/supporters/CodePath.png';
import iSchoolLogo from '../assets/supporters/iSchool.png';
import aarpLogo from '../assets/supporters/AARP.png';
import capOneLogo from '../assets/supporters/CapitalOne.png';
import { Link } from 'react-router-dom';

const Supporters = () => {
  return (
    <div id={styles.supportersContainer}>
      <h2>Our Supporters</h2>
      <h4 className={styles.divider}>
        <span>PLATINUM</span>
      </h4>
      <div className={styles.tierContainer}>
        <img src={geicoLogo} alt="Geico Logo" className={styles.supporterLogo} />
        <img src={workdayLogo} alt="Workday Logo" className={styles.supporterLogo} />
        <img src={aarpLogo} alt="AARP Logo" className={styles.supporterLogo} />
      </div>
      <h4 className={styles.divider}>
        <span>GOLD</span>
      </h4>
      <div className={styles.content}>
        <img src={codepathLogo} alt="CodePath Logo" className={styles.supporterLogo} />
      </div>
      <h4 className={styles.divider}>
        <span>SILVER</span>
      </h4>
      <div className={styles.tierContainer}>
        <img src={bloombergLogo} alt="Bloomberg Logo" className={styles.supporterLogo} />
        <img src={iSchoolLogo} alt="iSchool Logo" className={styles.supporterLogo} />
        <img src={capOneLogo} alt="Capital One Logo" className={styles.supporterLogo} />
      </div>
      {/* <h4 className={styles.divider}><span>BRONZE</span></h4> */}
      <Link className={styles.navLinks} to={'/contactus'}>
        {'Interested in partnering? Contact us!'}
      </Link>
    </div>
  );
};

export default Supporters;

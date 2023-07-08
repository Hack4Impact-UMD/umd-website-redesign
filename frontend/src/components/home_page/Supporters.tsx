import React from 'react';
import styles from '../../styles/home/Supporters.module.css';
import bloombergLogo from '../assets/supporters/Bloomberg.png';
import imcTradingLogo from '../assets/supporters/IMCTrading.png';
import aarpLogo from '../assets/supporters/AARP.png';
import { Link } from 'react-router-dom';

const Supporters = () => {
  return (
    <div id={styles.supportersContainer}>
      <h2>Our Supporters</h2>
      <h4 className={styles.divider}>
        <span>PLATINUM</span>
      </h4>
      <div className={styles.content}>
        <img src={aarpLogo} id={styles.supporterLogo} />
      </div>
      <h4 className={styles.divider}>
        <span>GOLD</span>
      </h4>
      <div className={styles.content}>
        <img src={imcTradingLogo} id={styles.supporterLogo} />
      </div>
      <h4 className={styles.divider}>
        <span>SILVER</span>
      </h4>
      <div className={styles.content}>
        <img src={bloombergLogo} id={styles.supporterLogo} />
      </div>
      {/* <h4 className={styles.divider}><span>BRONZE</span></h4> */}
      <Link className={styles.navLinks} to={'/contactus'}>
        {'Interested in partnering? Contact us!'}
      </Link>
    </div>
  );
};

export default Supporters;

import { Link } from 'react-router-dom';
import aarpLogo from '../../components/assets/supporters/AARP.png';
import bloombergLogo from '../../components/assets/supporters/Bloomberg.png';
import codepathLogo from '../../components/assets/supporters/CodePath.png';
import geicoLogo from '../../components/assets/supporters/Geico.png';
import iSchoolLogo from '../../components/assets/supporters/iSchool.png';
import uberLogo from '../../components/assets/supporters/Uber.png';
import workdayLogo from '../../components/assets/supporters/Workday.png';
import styles from './Supporters.module.css';

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
      </div>
      <h4 className={styles.divider}>
        <span>BRONZE</span>
      </h4>
      <div className={styles.tierContainer}>
        <img src={uberLogo} alt="Uber Logo" className={styles.supporterLogo} />
      </div>
      <Link className={styles.navLinks} to={'/contactus'}>
        {'Interested in partnering? Contact us!'}
      </Link>
    </div>
  );
};

export default Supporters;

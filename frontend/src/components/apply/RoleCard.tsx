import React from 'react';
import styles from '../../styles/apply/RoleCard.module.css';
import engineerLogo from '../assets/rolecard/engineer.svg';
import designerLogo from '../assets/rolecard/designer.svg';
import pmLogo from '../assets/rolecard/pm.svg';
import techleadLogo from '../assets/rolecard/techlead.svg';
import bootcampLogo from '../assets/rolecard/bootcamp.svg';
import bg1 from '../assets/rolecard/RoleCardBackground1.svg';
import bg2 from '../assets/rolecard/RoleCardBackground2.svg';
import bgHover1 from '../assets/rolecard/RoleCardBackgroundHover1.svg';
import bgHover2 from '../assets/rolecard/RoleCardBackgroundHover2.svg';

/*
 * RoleCard Component used in Apply pages.
 *
 * Adapted from ValueCard.
 *
 * Props:
 * revBackground (Boolean): if true, gradient is from blue to green.
 * Otherwise, gradient is from green to blue.
 * mainText (String): Header text
 * hoverText (String): Body text
 * role (int): Determines the logo shown. 1 = engineer, 2 = designer, 3 = pm, 4 = tech lead, 5 = bootcamp.
 *
 */
function RoleCard(props: any) {
  let roleCardClass: string;
  let bgMain: string;
  let bgHover: string;
  if (props.revBackground) {
    /* add additional rev class for mobile */
    roleCardClass = `${styles.roleCard} ${styles.rev}`;
    bgMain = bg2;
    bgHover = bgHover2;
  } else {
    roleCardClass = styles.roleCard;
    bgMain = bg1;
    bgHover = bgHover1;
  }

  let roleLogo: string;
  switch (props.role) {
    case 1:
      roleLogo = engineerLogo;
      break;
    case 2:
      roleLogo = designerLogo;
      break;
    case 3:
      roleLogo = pmLogo;
      break;
    case 4:
      roleLogo = techleadLogo;
      break;
    case 5:
      roleLogo = bootcampLogo;
      break;
    default:
      roleLogo = engineerLogo;
  }

  return (
    <div className={roleCardClass}>
      <div className={styles.content}>
        <div className={styles.header}>
          <img src={roleLogo} className={styles.logo} />
          <span className={styles.roleCardTextMain}>{props.mainText}</span>
        </div>
        <span className={styles.roleCardTextSub}>{props.hoverText}</span>
        <img src={bgMain} className={styles.roleCardBgMain} />
        <img src={bgHover} className={styles.roleCardBgHover} />
      </div>
    </div>
  );
}

export default RoleCard;

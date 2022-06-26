import React from 'react';
import styles from '../../styles/about_us/ValueCard.module.css';
import bg1 from '../assets/ValueCardBackground1.svg';
import bg2 from '../assets/ValueCardBackground2.svg';
import bgHover1 from '../assets/ValueCardBackgroundHover1.svg';
import bgHover2 from '../assets/ValueCardBackgroundHover2.svg';

/*
 * ValueCard Component used in AboutUs page.
 *
 * TODO: Use content div + padding rather than setting width of text boxes? See
 * RoleCard.
 *
 * Props:
 * revBackground (Boolean): if true, gradient is from blue to green.
 * Otherwise, gradient is from green to blue.
 * mainText (String): Header text
 * hoverText (String): Body text
 */
function ValueCard(props: any) {
  let valueCardClass: string;
  let bgMain: string;
  let bgHover: string;
  if (props.revBackground) {
    /* add additional rev class for mobile styling */
    valueCardClass = `${styles.valueCard} ${styles.rev}`;
    /* img src links for desktop styling */
    bgMain = bg2;
    bgHover = bgHover2;
  } else {
    bgMain = bg1;
    bgHover = bgHover1;
    valueCardClass = styles.valueCard;
  }

  return (
    <div className={valueCardClass}>
      <div className={styles.valueCardTextMain}>{props.mainText}</div>
      <div className={styles.valueCardTextSub}>{props.hoverText}</div>
      <img src={bgMain} className={styles.valueCardBg1} />
      <img src={bgHover} className={styles.valueCardBg2} />
    </div>
  );
}

export default ValueCard;

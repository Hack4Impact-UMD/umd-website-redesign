import React from 'react';
import styles from '../../styles/about_us/ValueCard.module.css';
/*
 * ValueCard Component used in AboutUs page.
 *
 * Props:
 * revBackground (Boolean): if true, gradient is from blue to green.
 * Otherwise, gradient is from green to blue.
 * mainText (String): Header text
 * hoverText (String): Body text
 */
function ValueCard(props: any) {
  let valueCardClass: string;
  if (props.revBackground) {
    /* add additional rev class for mobile styling */
    valueCardClass = `${styles.valueCard} ${styles.rev}`;
  } else {
    valueCardClass = styles.valueCard;
  }

  return (
    <div className={valueCardClass}>
      <div className={styles.cardFront}>
          <div className={styles.cardContentWrapper}>
              <div className={styles.valueCardTextMain}><h2 className={"alternateHeader"}>{props.mainText}</h2></div>
          </div>
      </div>

      <div className={styles.cardBack}>
          <div className={styles.cardContentWrapper}>
              <div className={styles.valueCardTextSub}>{props.hoverText}</div>
          </div>
      </div>
    </div>
  );
}

export default ValueCard;

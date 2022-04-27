import React from 'react';
import styles from './ValueCard.module.css';

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
  if (props.revBackground) {
    /* add additional rev class */
    valueCardClass = `${styles.valueCard} ${styles.rev}`;
  } else {
    valueCardClass = styles.valueCard;
  }

  return (
    <div className={valueCardClass}>
      <span className={styles.valueCardTextMain}>{props.mainText}</span>
      <span className={styles.valueCardTextSub}>{props.hoverText}</span>
    </div>
  );
}

export default ValueCard;

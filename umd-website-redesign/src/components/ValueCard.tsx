import React from 'react';
import styles from './ValueCard.module.css';

function ValueCard(props: any) {
  return (
    <div className={styles.valuesCard}>
      <span className={styles.valuesCardTextMain}>{props.mainText}</span>
      <span className={styles.valuesCardTextHover}>{props.hoverText}</span>
    </div>
  );
}

export default ValueCard;

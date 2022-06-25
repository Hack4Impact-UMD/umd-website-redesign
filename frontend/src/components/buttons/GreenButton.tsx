import React from 'react';
import styles from '../../styles/buttons/Buttons.module.css';


function GreenButton(props: any) {
  return (
    <a href={props.link}>
      <button aria-label={props.text} className={styles.greenbutton}>
          {props.text}
      </button>
    </a>

  );
}

export default GreenButton;

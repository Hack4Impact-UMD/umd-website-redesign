import React, { useState } from 'react';
import styles from '../styles/people/Person.module.css';
import default_pfp from "../components/assets/icons/default_pfp.png";
import { FADE_IN_TRANSITION } from '../constants/animations';

function Person(props: any) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  let imageSrc: string;
  if (props.src == undefined || props.src == null) {
    imageSrc = default_pfp;
  } else {
    if (props.src.startsWith('/')) {
      imageSrc = process.env.REACT_APP_ROOT_URL + props.src;
    } else {
      imageSrc = props.src;
    }
  }

  return (
    <div className={styles.Person}>
      <img
        src={imageError ? default_pfp : imageSrc}
        alt={props.memberName || 'Team member'}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
        style={{ opacity: imageLoaded ? 1 : 0, transition: FADE_IN_TRANSITION }}
      />
      <h2>{props.memberName}</h2>
      <p className={styles.team}>{props.team}</p>
      <p>{props.role}</p>
      <p className={styles.Pronouns}>{props.pronouns}</p>
    </div>
  );
}

export default Person;

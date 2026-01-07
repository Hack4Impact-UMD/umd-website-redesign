import React from 'react';
import styles from '../styles/people/Person.module.css';
import globe from './assets/h4i_files/globe.svg';
import default_pfp from "../components/assets/icons/default_pfp.png"

/*
 * Person component
 * Props:
 * src: path to image. default to globe if not given.
 * memberName, team, role, pronouns: strings for each field.
 */
function Person(props: any) {
  let imageSrc: string;
  if (props.src == undefined || props.src == null) {
    imageSrc = default_pfp;
  } else {
    // If the image URL is relative (starts with /), prepend the backend URL
    if (props.src.startsWith('/')) {
      imageSrc = process.env.REACT_APP_ROOT_URL + props.src;
    } else {
      imageSrc = props.src;
    }
  }

  return (
    <div className={styles.Person}>
      <img src={imageSrc} />
      <h2>{props.memberName}</h2>
      <p className={styles.team}>{props.team}</p>
      <p>{props.role}</p>
      <p className={styles.Pronouns}>{props.pronouns}</p>
    </div>
  );
}

export default Person;

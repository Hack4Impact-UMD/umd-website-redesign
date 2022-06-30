import React from 'react';
import styles from '../../styles/buttons/StandardButton.module.css';
import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  link: string;
  color: string;
  ariaLabel?: string;
  externalLink?: boolean;
}

/*
Color options: blue, green.
If link is external, set externalLink to true.
*/
const StandardButton = (props: ButtonProps) => {
  let buttonClass: string;

  // Update class so stylesheet can change colors.
  switch (props.color) {
    case 'green':
      buttonClass = `${styles.button} ${styles.green}`;
      break;
    case 'blue':
      buttonClass = `${styles.button} ${styles.blue}`;
      break;
    default:
      buttonClass = `${styles.button} ${styles.green}`;
  }

  const buttonComponent = (
    <button className={buttonClass} type={'button'} aria-label={props.ariaLabel}>
      {props.text}
    </button>
  );

  // If the link is external, use an <a> tag. Otherwise, use a <Link> tag.
  if (props.externalLink) {
    return <a href={props.link}>{buttonComponent}</a>;
  } else {
    return <Link to={props.link}>{buttonComponent}</Link>;
  }
};

export default StandardButton;

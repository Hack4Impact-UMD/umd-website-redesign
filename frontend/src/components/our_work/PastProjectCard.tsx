import React from 'react';
import styles from '../../styles/our_work/PastProjectCard.module.css';

/* defines the parameters to pass into a project card */
export interface PastProjectCardData {
  link: string;
  title: string;
  date: string;
  image: string;
  altText: string;
}

export const PastProjectCard = ({ link, title, date, image, altText }: PastProjectCardData): JSX.Element => {
  return (
    <div id={styles.cardContainer}>
      <div id={styles.cardImageContainer}>
        <a href={link}>
          <img src={image} alt={altText} id={styles.cardImage}></img>
        </a>
      </div>
      <div id={styles.cardTextContainer}>
        <div id={styles.cardTitleContainer}>
          <a id={styles.cardTitle} href={link}>
            {title}
          </a>
        </div>
        <div id={styles.cardDateContainer}>{date}</div>
        <div id={styles.cardLinkContainer}>
          <a id={styles.cardLink} href={link}>
            read more
          </a>
        </div>
      </div>
    </div>
  );
};

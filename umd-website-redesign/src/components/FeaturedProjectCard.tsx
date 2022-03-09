import React from 'react';
import styles from '../styles/ProjectCard.module.css';

/* defines the parameters to pass into a project card */
export interface FeaturedProjectCardData {
  link: string;
  title: string;
  date: string;
  summary: string;
  image: string;
  altText: string;
}

const FeaturedProjectCard = ({ link, title, date, summary, image, altText }: FeaturedProjectCardData): JSX.Element => {
  return (
    <div id={styles.cardContainer}>
      <div id={styles.cardImageContainer}>
        <img src={image} alt={altText} id={styles.cardImage}></img>
      </div>
      <div id={styles.cardTextContainer}>
        <div id={styles.cardHeadingContainer}>
          <div id={styles.cardTitle}>{title}</div>
          <div id={styles.cardDate}>{date}</div>
        </div>
        <div id={styles.cardSummary}>{summary}</div>
        <div id={styles.cardLinkContainer}>
          <a id={styles.cardLink} href={link}>
            read more
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;

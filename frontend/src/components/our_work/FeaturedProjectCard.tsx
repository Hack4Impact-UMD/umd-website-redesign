import React from 'react';
import styles from '../../styles/our_work/FeaturedProjectCard.module.css';

/* defines the parameters to pass into a project card */
export interface FeaturedProjectCardData {
  link: string;
  title: string;
  date: string;
  summary: string;
  image: string;
  altText: string;
}

/* Splits a Project Card into one div for the image and one for the text */
const FeaturedProjectCard = ({ link, title, date, summary, image, altText }: FeaturedProjectCardData): JSX.Element => {
  return (
    <div id={styles.cardContainer}>
      <div id={styles.cardImageContainer}>
        <a href={link}>
          <img src={image} alt={altText} id={styles.cardImage}></img>
        </a>
      </div>
      <div id={styles.cardTextContainer}>
        <div id={styles.cardHeadingContainer}>
          <div id={styles.cardTitleContainer}>
            <a id={styles.cardTitle} href={link}>
              {title}
            </a>
          </div>
          <div id={styles.cardDateContainer}>{date}</div>
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

import React from 'react';
import styles from '../../styles/home/FeaturedProjectCard.module.css';

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
        <div id={styles.cardVariableTextContainer}>
          <div id={styles.cardHeadingContainer}>
            <div id={styles.cardTitleContainer}>
              <a id={styles.cardTitle} href={link}>
                <h3>{title}</h3>
              </a>
            </div>
            <div id={styles.cardDateContainer}>
              <h3>{date}</h3>
            </div>
          </div>
          <div id={styles.cardSummary}>
            <p>{summary}</p>
          </div>
        </div>
        <div id={styles.cardLinkContainer}>
          <a id={styles.cardLink} href={link}>
            <p>read more</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;

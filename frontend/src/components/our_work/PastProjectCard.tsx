import React, { useState } from 'react';
import styles from '../../styles/our_work/PastProjectCard.module.css';

export interface PastProjectCardData {
  link: string;
  title: string;
  date: string;
  image: string;
  altText: string;
}

export const PastProjectCard = ({ link, title, date, image, altText }: PastProjectCardData): JSX.Element => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div id={styles.cardContainer}>
      <div id={styles.cardImageContainer}>
        <a href={link}>
          <img
            src={image}
            alt={altText}
            id={styles.cardImage}
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        </a>
      </div>
      <div id={styles.cardTextContainer}>
        <div id={styles.cardTitleContainer}>
          <a id={styles.cardTitle} href={link}>
            <h3>{title}</h3>
          </a>
        </div>
        <div id={styles.cardDateContainer}>
          <h3>{date}</h3>
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

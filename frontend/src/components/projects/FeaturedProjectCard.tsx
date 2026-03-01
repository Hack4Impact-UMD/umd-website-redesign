import React, { useState } from 'react';
import styles from '../../styles/projects/FeaturedProjectCard.module.css';
import { FADE_IN_TRANSITION } from '../../constants/animations';
import { resolveMediaUrl } from '@/lib/media';

export interface FeaturedProjectCardData {
  link: string;
  title: string;
  date: string;
  summary: string;
  image: string;
  altText: string;
}

const FeaturedProjectCard = ({ link, title, date, summary, image, altText }: FeaturedProjectCardData): JSX.Element => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageSrc = resolveMediaUrl(image) || image;

  return (
    <div id={styles.cardContainer}>
      <div id={styles.cardImageContainer}>
        <a href={link}>
          <img
            src={imageSrc}
            alt={altText}
            id={styles.cardImage}
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: FADE_IN_TRANSITION }}
          />
        </a>
      </div>
      <div id={styles.cardDetailsContainer}>
        <div id={styles.cardDetails}>
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

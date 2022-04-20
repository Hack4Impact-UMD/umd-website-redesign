import React from 'react';
import styles from '../../styles/our_work/PastProjectCard.module.css';
import { Col } from 'react-bootstrap';

/* defines the parameters to pass into a project card */
export interface PastProjectCardData {
  link: string;
  title: string;
  date: string;
  image: string;
  altText: string;
}

export const PastProjectCard = ({
  link,
  title,
  date,
  image,
  altText,
}: PastProjectCardData): JSX.Element => {
  return (
    <Col id={styles.cardContainer}>
      <div id={styles.cardImageContainer}>
        <img src={image} alt={altText} id={styles.cardImage}></img>
      </div>
      <div id={styles.cardTextContainer}>
        <p id={styles.cardTitle}>{title}</p>
        <p id={styles.cardDate}>{date}</p>
        <a id={styles.cardLink} href={link}>
          learn more
        </a>
      </div>
    </Col>
  );
};

import React from 'react';
import styles from '../../styles/home/HomePageTop.module.css';
import blueBG from '../assets/backgrounds/blue-bg.svg';
import graphic from '../assets/graphic.svg';
import StandardButton from '../buttons/StandardButton';
import ImageWithLoading from '../ImageWithLoading';

const HomePageTop = () => {
  return (
    <div>
      <ImageWithLoading className={styles.blueBG} src={blueBG} alt="Background decoration" />
      <div className={styles.header}>
        <div className={styles.text}>
          <h1 className={styles.textOne}>
              Building powerful nonprofit software as a tool for{' '}
              <span className={styles.socialGoodSubText}>social good</span>
          </h1>
          <h3 className={styles.textTwo}>
            We are a student-run organization that empowers engineers, designers, activists, and humanitarians to create
            lasting social change.
          </h3>
          <div className={styles.mintbtn}>
            <StandardButton text="Learn More" color="green" link="/aboutus" />
          </div>
        </div>
        <ImageWithLoading className={styles.graphic} src={graphic} alt="Hack4Impact illustration" />
      </div>
      
      <div className={styles.center}>
        <h2 className={styles.featuredTitle}>Featured Projects</h2>
        <p className={styles.featuredDescription}>
          We are the University of Maryland, College Park chapter of the national Hack4Impact organization, a
          student-run 501(c)(3) dedicated to building software for social impact. Each year, we partner with nonprofits
          to help them better serve their communities.
        </p>
      </div>
    </div>
  );
};

export default HomePageTop;

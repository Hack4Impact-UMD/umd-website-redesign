import React from 'react';
import styles from '../../styles/home/HomePageTop.module.css';
import blueBG from '../assets/blue-bg.svg';
import graphic from '../assets/graphic.svg';
import OblongButton from '../buttons/OblongButton';
//first div is for background, second div is for left side text
const HomePageTop = () => {
  return (
    <div>
        <img className={styles.blueBG} src={blueBG}></img>
      <div className={styles.top}>
        <div className={styles.textOne}>
          <p className={styles.textOne}>
          Building powerful nonprofit software as a tool for <span className={styles.socialGoodSubText}>social good</span>
          </p>
        </div>
        <p className={styles.textTwo}>
        We are a student-run organization that empowers engineers, designers, activists, and humanitarians to create lasting social change.
        </p>
        <div className={styles.mintbtn}>
        <OblongButton text="Learn More" color="green" link="/aboutus"/>
        </div>
        <img className={styles.graphic} src={graphic}></img>
      </div>
      <div className={styles.center}>
        <header className={styles.featuredTitle}>Featured Projects</header>
        <p className={styles.featuredDescription}>We are the University of Maryland, College Park chapter of the national Hack4Impact organization, a student-run 501(c)(3) dedicated to building software for social impact. Each year, we partner with nonprofits to help them better serve their communities.</p>
      </div>
    </div>
  );
};

export default HomePageTop;

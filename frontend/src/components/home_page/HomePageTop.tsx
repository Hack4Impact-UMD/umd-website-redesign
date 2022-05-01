import React from 'react';
import styles from '../../styles/home/HomePageTop.module.css';
import blueBG from '../assets/blue-bg.svg';
import graphic from '../assets/graphic.svg';
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
        <button aria-label="Learn More" className={styles.mintbtn}>
              Learn More
            </button>
        <img className={styles.graphic} src={graphic}></img>
          <div className={styles.hide}>
            <button className={styles.green}>TEST</button>
          </div>
      </div>
    </div>
  );
};

export default HomePageTop;
import React from 'react';
import styles from './HomePageTop.css';
import blueBG from './blue-bg.svg';
import graphic from './graphic.svg';
//first div is for background, second div is for left side text
const HomePageTop = () => {
  return (
    <div>
        <img className="blueBG" src={blueBG}></img>
      <div>
        <p className="textOne">
        Building powerful nonprofit software as a tool for <span className="socialGoodSubText">social good</span>
        </p>
        <p className="textTwo">
        We are a student-run organization that empowers engineers, designers, activists, and humanitarians to create lasting social change.
        </p>
      </div>
        <img className="graphic" src={graphic}></img>
          <button className={styles.green}></button>
          <button className="mintbtn">
              Learn More
            </button>
    </div>
  );
};

export default HomePageTop;
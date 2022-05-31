import React from 'react';
import styles from '../../styles/projects/ProjectsTop.module.css';
import blueBG from '../assets/blue-bg.svg';
import graphic from '../assets/graphic.svg';
import projectPicture from '../assets/projectBG.png';
//first div is for background, second div is for left side text
const HomePageTop = () => {
  return (
    <div>
        <img className={styles.blueBG} src={blueBG}></img>
        <header className={styles.title}>2Unstoppable</header>
        <div>
          <div className={styles.projectInfoContainer}>
            <div className={styles.flexChild}>
              <img src={projectPicture}></img>
            </div>
            <div className={styles.flexChild}>
              <h1 className={styles.date}>Spring 2022</h1>
              <p className={styles.projectDescription}>Blurb about the client/project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in.</p>
            </div>
        </div>
        </div>
    </div>
  );
};

export default HomePageTop;
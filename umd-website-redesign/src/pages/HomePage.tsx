import React from 'react';
import FeaturedProjects from '../components/FeaturedProjects';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div>
      <div>
        <h1>Header Area</h1>
        <a href="https://www.google.com">
          <button className={styles.mintbtn}>Learn More</button>
        </a>
      </div>
      <div>
        <h1>Featured Projects</h1>
        <div>
          <FeaturedProjects />
        </div>
        <a href="https://www.google.com">
          <button className={styles.bluebtn}>See More</button>
        </a>
      </div>
    </div>
  );
};

export default Home;

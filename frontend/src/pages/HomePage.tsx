import React from 'react';
import FeaturedProjects from '../components/our_work/FeaturedProjects';
import HomePageLower from '../components/home_page/HomePageLower';

/* Testing SVG backgrounds
import { ReactComponent as BlueWave } from '../components/assets/bluewave_desktop.svg';
import { ReactComponent as MintWave } from '../components/assets/mintwave_desktop.svg';
import styles from '../styles/Home.module.css'; 

const Home: React.FC = () => {
  return (
    <div id={styles.allpagecontent}>
      <BlueWave id={styles.bgbluewave} />
      <MintWave id={styles.bgmintwave} />
      <div id={styles.content}>
        <div>
          <h1>Placeholder Area for Top Section</h1>
        </div>
        <FeaturedProjects />
        <HomePageLower />
      </div>
    </div>
  );
};
*/

const Home: React.FC = () => {
  return (
    <div>
      <div>
        <h1>Placeholder Area for Top Section</h1>
      </div>
      <FeaturedProjects />
      <HomePageLower />
    </div>
  );
};

export default Home;

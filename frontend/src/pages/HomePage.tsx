import React from 'react';
import FeaturedProjects from '../components/home_page/FeaturedProjects';
import HomePageLower from '../components/home_page/HomePageLower';
import HomePageTop from '../components/home_page/HomePageTop';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import styles from '../styles/home/HomePage.module.css';

const Home: React.FC = () => {
  return (
    <div>
      <div className={styles.mydiv}>
        <Navbar />
        <HomePageTop />
        <FeaturedProjects />
        <HomePageLower />
        <Footer />
      </div>
    </div>
  );
};

export default Home;

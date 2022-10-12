import React from 'react';
import HomePageLower from '../components/home_page/HomePageLower';
import HomePageTop from '../components/home_page/HomePageTop';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Projects from '../components/projects/Projects';
import styles from '../styles/home/HomePage.module.css';

const Home: React.FC = () => {
  return (
    <div>
      <div className={styles.mydiv}>
        <Navbar />
        <HomePageTop />
        <Projects isFeatured = {true} />
        <HomePageLower />
        <Footer />
      </div>
    </div>
  );
};

export default Home;

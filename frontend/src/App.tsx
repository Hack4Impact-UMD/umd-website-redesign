import './App.css';
import Navbar from './components/Navbar/Navbar';
import Top from './components/Top/HomePageTop'
import FeaturedProjects from './components/Bottom/FeaturedProjects/FeaturedProjects';
import HomePageLower from './components/Bottom/HomePageLower';
import React from 'react'
import Footer from './components/Bottom/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Top />
      <FeaturedProjects />
      <HomePageLower />
      <Footer />
    </div>
  );
}

export default App;

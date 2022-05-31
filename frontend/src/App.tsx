import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePageTop from './components/home_page/HomePageTop';
import HomePageLower from './components/home_page/HomePageLower';
import Navbar from './components/navbar/Navbar';
import FeaturedProjects from './components/our_work/FeaturedProjects';

function App() {
  return (
    <div className="App">
      <HomePageTop/>
      <FeaturedProjects/>
      <HomePageLower/>
    </div>
  );
}

export default App;
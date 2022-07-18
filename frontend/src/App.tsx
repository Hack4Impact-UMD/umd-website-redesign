import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HomePageTop from './components/home_page/HomePageTop';
import HomePageLower from './components/home_page/HomePageLower';
import FeaturedProjects from './components/home_page/FeaturedProjects';


function App() {
  return (
    <div className="App">
      <HomePageTop />
      <FeaturedProjects />
      <HomePageLower />
    </div>
  );
}

export default App;
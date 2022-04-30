import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import OurWork from './pages/OurWork';
import Navbar from './components/Navbar/Navbar';
import Top from './components/Top/HomePageTop'
import FeaturedProjects from './components/Bottom/FeaturedProjects/FeaturedProjects';
import HomePageLower from './components/Bottom/HomePageLower';
import Footer from './components/Bottom/Footer/Footer';

function App() {
  return (
    <div className="App">
      <OurWork/>
    </div>
  );
}

export default App;

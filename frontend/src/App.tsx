import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage'
import OurWork from './pages/OurWork';
import Projects from './pages/Projects'

/*import Navbar from './components/navbar/Navbar';
import Top from './components/home_page/HomePageTop';
import FeaturedProjects from './components/our_work/FeaturedProjects';
import HomePageLower from './components/home_page/HomePageLower';
import Footer from './components/footer/Footer';*/
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <div className="App">
      <Projects/>
    </div>
  );
}

export default App;

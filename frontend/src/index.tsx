import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter, Routes } from "react-router-dom";

// importing pages 
import App from './App';
import AboutUs from './pages/AboutUs';
import Navbar from './components/navbar/Navbar';
import StudentApply from './pages/StudentApply';
import Footer from './components/footer/Footer';
import OurWork from './pages/OurWork';

const routing = (
  <BrowserRouter>
    <div>
    <Navbar/>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="/ourwork" element={<OurWork/>} />
        <Route path="/apply" element={<StudentApply/>} />
        <Route path="/contactus" element={<App/>} />
      </Routes>
    <Footer/>
    </div>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));
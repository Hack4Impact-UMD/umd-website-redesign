import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter, Routes, useParams,} from "react-router-dom";

// importing pages 
import App from './App';
import AboutUs from './pages/AboutUs';
import Navbar from './components/navbar/Navbar';
import StudentApply from './pages/StudentApply';
import Footer from './components/footer/Footer';
import OurWork from './pages/OurWork';

import ProjectPage from './pages/ProjectPage';

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
        {/* <Route path="/project" element={<ProjectPage/>} /> */}

        {/* Component */}
        <Route path="ourwork/:projectname" element={<ProjectPage/>} />
      </Routes>
    <Footer/>
    </div>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));
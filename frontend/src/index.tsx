import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

// importing pages
import App from './App';
import AboutUs from './pages/AboutUs';
import Navbar from './components/navbar/Navbar';
import StudentApply from './pages/StudentApply';
import NonprofitApply from './pages/NonprofitApply';
import Footer from './components/footer/Footer';
import OurWork from './pages/OurWork';

import ProjectPage from './pages/ProjectPage';

const routing = (
  <BrowserRouter>
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="/ourwork" element={<OurWork/>} />
        <Route path="/apply" element={<StudentApply/>} />
        <Route path="/apply/student" element={<StudentApply />} />
        <Route path="/apply/nonprofit" element={<NonprofitApply />} />
        <Route path="/contactus" element={<App/>} />
        <Route path="ourwork/:projectpath" element={<ProjectPage/>} />
      </Routes>
      <Footer />
    </div>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));

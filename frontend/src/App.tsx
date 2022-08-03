import React, { useLayoutEffect } from 'react';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HomePageTop from './components/home_page/HomePageTop';
import HomePageLower from './components/home_page/HomePageLower';
import FeaturedProjects from './components/home_page/FeaturedProjects';
import AboutUs from './pages/AboutUs';
import Navbar from './components/navbar/Navbar';
import StudentApply from './pages/StudentApply';
import NonprofitApply from './pages/NonprofitApply';
import Footer from './components/footer/Footer';
import OurWork from './pages/OurWork';
import ProjectPage from './pages/ProjectPage';
import PageNotFound from './pages/PageNotFound';

// Scrolls to top of
// https://stackoverflow.com/a/70194027
const ScrollToTopWrapper = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

function Homepage() {
  return (
    <div>
      <HomePageTop />
      <FeaturedProjects />
      <HomePageLower />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopWrapper>
        <div>
          <Navbar />
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/ourwork" element={<OurWork />} />
            <Route path="/apply" element={<StudentApply />} />
            <Route path="/apply/student" element={<StudentApply />} />
            <Route path="/apply/nonprofit" element={<NonprofitApply />} />
            <Route path="/contactus" element={<App />} />
            <Route path="ourwork/:projectpath" element={<ProjectPage />} />
          </Routes>
          <Footer />
        </div>
      </ScrollToTopWrapper>
    </BrowserRouter>
  );
}

export default App;

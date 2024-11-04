import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import ScrollToTopButton from './components/buttons/ScrollToTopButton';
import Footer from './components/footer/Footer';
import HomePageLower from './components/home_page/HomePageLower';
import HomePageTop from './components/home_page/HomePageTop';
import Supporters from './components/home_page/Supporters';
import Navbar from './components/navbar/Navbar';
import Projects from './components/projects/Projects';
import AboutUs from './pages/AboutUs';
import ContactPage from './pages/ContactPage';
import NonprofitApply from './pages/NonprofitApply';
import OurWork from './pages/OurWork';
import PageNotFound from './pages/PageNotFound';
import ProjectPage from './pages/ProjectPage';
import StudentApply from './pages/StudentApply';

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
      <Projects isFeatured={true} />
      <HomePageLower />
      <Supporters />
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
            <Route path="/apply-f24" element={<AppsPage />} />
            <Route path="/apply" element={<StudentApply />} />
            <Route path="/apply/student" element={<StudentApply />} />
            <Route path="/apply/nonprofit" element={<NonprofitApply />} />
            <Route path="/contactus" element={<ContactPage />} />
            <Route path="ourwork/:projectpath" element={<ProjectPage />} />
          </Routes>
          <Footer />
          <ScrollToTopButton />
        </div>
      </ScrollToTopWrapper>
    </BrowserRouter>
  );
}

const AppsPage = () => {
  useEffect(() => {
    window.location.href = 'https://forms.gle/FmHsAnhaExZZKjm49';
  }, []);

  return null;
};

export default App;

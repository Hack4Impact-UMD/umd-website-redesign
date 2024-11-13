import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import { useEffect, useLayoutEffect } from 'react';
import { AuthProvider } from './components/auth/AuthProvider';
import ScrollToTopButton from './components/buttons/ScrollToTopButton';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Projects from './components/projects/Projects';
import AboutUs from './pages/AboutUsPage/AboutUs';
import AdminLoginPage from './pages/AdminPages/AdminLogin/AdminLoginPage';
import NonprofitApply from './pages/ApplyPages/NonprofitApply';
import StudentApply from './pages/ApplyPages/StudentApply';
import ContactPage from './pages/ContactUs/ContactPage';
import HomePageLower from './pages/HomePage/HomePageLower';
import HomePageTop from './pages/HomePage/HomePageTop';
import Supporters from './pages/HomePage/Supporters';
import OurWork from './pages/OurWork/OurWork';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import ProjectPage from './pages/Projects/ProjectPage';

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
    <AuthProvider>
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
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Routes>
            <Footer />
            <ScrollToTopButton />
          </div>
        </ScrollToTopWrapper>
      </BrowserRouter>
    </AuthProvider>
  );
}

const AppsPage = () => {
  useEffect(() => {
    window.location.href = 'https://forms.gle/FmHsAnhaExZZKjm49';
  }, []);

  return null;
};

export default App;

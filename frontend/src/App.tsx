import { useLayoutEffect } from 'react';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';

import AboutUs from './pages/AboutUs';
import ContactPage from './pages/ContactPage';
import StudentApply from './pages/StudentApply';
import NonprofitApply from './pages/NonprofitApply';
import OurWork from './pages/OurWork';
import ProjectPage from './pages/ProjectPage';
import PageNotFound from './pages/PageNotFound';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroCarousel from './components/home/HeroCarousel';
import NonprofitMapSection from './components/home/NonprofitMapSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import NewsletterSection from './components/home/NewsletterSection';
import SponsorsSection from './components/home/SponsorsSection';
import CTASection from './components/home/CTASection';
import ScrollToTopButton from './components/buttons/ScrollToTopButton';
import RecruitmentBanner from './components/banner/RecruitmentBanner';

const ScrollToTopWrapper = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

function Homepage() {
  return (
    <main>
      <HeroCarousel />
      <NonprofitMapSection />
      <TestimonialsSection />
      <NewsletterSection />
      <SponsorsSection />
      <CTASection />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopWrapper>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          {/* RecruitmentBanner hidden - uncomment when needed */}
          {/* <RecruitmentBanner /> */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/ourwork" element={<OurWork />} />
              <Route path="/apply" element={<StudentApply />} />
              <Route path="/apply/student" element={<StudentApply />} />
              <Route path="/apply/nonprofit" element={<NonprofitApply />} />
              <Route path="/contactus" element={<ContactPage />} />
              <Route path="ourwork/:projectpath" element={<ProjectPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
          <Footer />
          <ScrollToTopButton />
        </div>
      </ScrollToTopWrapper>
    </BrowserRouter>
  );
}

export default App;

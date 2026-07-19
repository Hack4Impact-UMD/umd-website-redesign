import { useLayoutEffect } from 'react';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';

import AboutUs from './pages/AboutUs';
import StudentApply from './pages/StudentApply';
import NonprofitApply from './pages/NonprofitApply';
import OurWork from './pages/OurWork';
import ProjectPage from './pages/ProjectPage';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/buttons/ScrollToTopButton';

const ScrollToTopWrapper = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopWrapper>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/ourwork" element={<OurWork />} />
              <Route path="/apply" element={<StudentApply />} />
              <Route path="/apply/student" element={<StudentApply />} />
              <Route path="/apply/nonprofit" element={<NonprofitApply />} />
              <Route path="/ourwork/:projectpath" element={<ProjectPage />} />
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

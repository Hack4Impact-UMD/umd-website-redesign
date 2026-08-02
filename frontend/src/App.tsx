import { useLayoutEffect } from 'react';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';

import { getContentDocument } from './api/content';

import AboutUs from './pages/AboutUs';
import StudentApply from './pages/StudentApply';
import NonprofitApply from './pages/NonprofitApply';
import OurWork from './pages/OurWork';
import ProjectPage from './pages/ProjectPage';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/buttons/ScrollToTopButton';
import { defaultSiteSettings, resolveSiteSettingsContent } from './content/site-settings';
import { useApiResource } from './hooks';

const loadSiteSettings = (signal: AbortSignal) => getContentDocument('site-settings', signal);

const ScrollToTopWrapper = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

function App() {
  const { data, status } = useApiResource(loadSiteSettings);
  const siteSettings = status === 'success'
    ? resolveSiteSettingsContent(data)
    : defaultSiteSettings;

  return (
    <BrowserRouter>
      <ScrollToTopWrapper>
        <div className="min-h-screen flex flex-col">
          <Navbar settings={siteSettings} />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/ourwork" element={<OurWork />} />
              <Route path="/apply" element={<StudentApply />} />
              <Route path="/apply/student" element={<StudentApply />} />
              <Route path="/apply/nonprofit" element={<NonprofitApply />} />
              <Route path="/contactus" element={<ContactUs settings={siteSettings} />} />
              <Route path="/ourwork/:projectpath" element={<ProjectPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
          <Footer settings={siteSettings} />
          <ScrollToTopButton />
        </div>
      </ScrollToTopWrapper>
    </BrowserRouter>
  );
}

export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import { useEffect, useLayoutEffect } from 'react';
import { AuthProvider } from './components/auth/AuthProvider';
import RequireAuth from './components/auth/RequireAuth';
import ScrollToTopButton from './components/buttons/ScrollToTopButton';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import AboutUs from './pages/AboutUsPage/AboutUs';
import AdminLoginPage from './pages/AdminPages/AdminLogin/AdminLoginPage';
import AdminMembers from './pages/AdminPages/AdminMembers/AdminMembers';
import AdminProjects from './pages/AdminPages/AdminProjects/AdminProjects';
import AdminSponsors from './pages/AdminPages/AdminSponsors/AdminSponsors';
import AdminTestingPage from './pages/AdminPages/AdminTestingPage/AdminTestingPage';
import NonprofitApply from './pages/ApplyPages/NonprofitApply';
import StudentApply from './pages/ApplyPages/StudentApply';
import ContactPage from './pages/ContactUs/ContactPage';
import HomePage from './pages/HomePage/HomePage';
import OurWork from './pages/OurWork/OurWork';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import ProjectPage from './pages/Projects/ProjectPage';
import AdminMembersDisplay from './pages/AdminPages/AdminMembers/AdminMembersDisplay';

// Scrolls to top of
// https://stackoverflow.com/a/70194027
const ScrollToTopWrapper = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTopWrapper>
          <div>
            <Navbar />
            <Routes>
              <Route path="*" element={<PageNotFound />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/ourwork" element={<OurWork />} />
              <Route path="/apply-f24" element={<AppsPage />} />
              <Route path="/apply" element={<StudentApply />} />
              <Route path="/apply/student" element={<StudentApply />} />
              <Route path="/apply/nonprofit" element={<NonprofitApply />} />
              <Route path="/contactus" element={<ContactPage />} />
              <Route path="ourwork/:projectpath" element={<ProjectPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/members"
                element={
                  <RequireAuth>
                    <AdminMembers />
                  </RequireAuth>
                }
              />
              <Route 
                path="/admin/display/members"
                element={
                  <RequireAuth>
                    <AdminMembersDisplay />
                  </RequireAuth>
                }/>
              <Route
                path="/admin/sponsors"
                element={
                  <RequireAuth>
                    <AdminSponsors />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <RequireAuth>
                    <AdminProjects />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/testing"
                element={
                  <RequireAuth>
                    <AdminTestingPage />
                  </RequireAuth>
                }
              />
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

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import h4iLogo from '../assets/h4i_files/h4i_logo.svg';
import Hamburger from '../assets/hamburger_icon.svg';
import CloseButton from '../assets/navbar_close_button.svg';
import styles from './Navbar.module.css';

const Navbar = () => {
  // Use the admin navbar on admin pages
  const location = useLocation();
  if (location.pathname.startsWith('/admin/')) {
    return null;
  }

  const [isMenuOpen, setMenuOpen] = useState(false);

  // if window <= 1000, will toggle hamburger menu
  // otherwise, will scroll to top of current page, if current page link was clicked
  function toggleOrScroll(to: string) {
    toggleMenu();
    scroll(to);
  }

  // only scrolls to top of the current page if it's wide enough not to have the hamburger menu
  const scroll = (to: string) => {
    if (window.innerWidth > 1000 && window.location.pathname == to) {
      window.scrollTo(0, 0);
    }
  };

  const toggleMenu = () => {
    if (window.innerWidth <= 1000) {
      setMenuOpen(!isMenuOpen);
    }
  };

  return (
    <div>
      <div className={isMenuOpen ? styles.blurOverlay : `${styles.blurOverlay} ${styles.hidden}`}></div>
      <nav className={styles.navbarItems}>
        <Link to="/" onClick={() => scroll('/')}>
          <img alt="Hack4Impact Logo" className={styles.logo} src={h4iLogo}></img>
        </Link>
        <img className={styles.navIcon} src={isMenuOpen ? CloseButton : Hamburger} onClick={toggleMenu} />

        <ul className={isMenuOpen ? styles.navMenu : `${styles.navMenu} ${styles.hidden}`}>
          <li>
            <Link className={styles.navLinks} to={'/aboutus'} onClick={() => toggleOrScroll('/aboutus')}>
              {'About Us'}
            </Link>
          </li>
          <li>
            <Link className={styles.navLinks} to={'/ourwork'} onClick={() => toggleOrScroll('/ourwork')}>
              {'Our Work'}
            </Link>
          </li>
          <li>
            <Link
              className={styles.navLinks + ' ' + styles.applyDropdownButton}
              to={'/apply/student'}
              onClick={() => toggleOrScroll('/apply/student')}
            >
              Apply
            </Link>
            <div className={`${styles.applyDropdownContainer} ${styles.menuOpen}`}>
              <ul className={styles.applyDropdownContent}>
                <li>
                  <Link
                    className={styles.navLinks}
                    to={'/apply/student'}
                    onClick={() => toggleOrScroll('/apply/student')}
                  >
                    {'For Students'}
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.navLinks}
                    to={'/apply/nonprofit'}
                    onClick={() => toggleOrScroll('/apply/nonprofit')}
                  >
                    {'For Nonprofits'}
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link className={styles.navLinks} to={'/contactus'} onClick={() => toggleOrScroll('/contactus')}>
              {'Contact Us'}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

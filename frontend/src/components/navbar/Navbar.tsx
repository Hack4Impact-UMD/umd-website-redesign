import React, { useState } from 'react';
import Hamburger from '../assets/hamburger_icon.svg';
import CloseButton from '../assets/navbar_close_button.svg';
import styles from '../../styles/navbar/Navbar.module.css';
import h4iLogo from '../assets/h4i_files/h4i_logo.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    if (window.innerWidth <= 1000) {
      setMenuOpen(!isMenuOpen)
    }
  };

  return (
    <div>
      <div className={isMenuOpen ? styles.blurOverlay : `${styles.blurOverlay} ${styles.hidden}`}></div>
      <nav className={styles.navbarItems}>
        <Link to="/">
          <img alt="Hack4Impact Logo" className={styles.logo} src={h4iLogo}></img>
        </Link>
        <img className={styles.navIcon} src={isMenuOpen ? CloseButton : Hamburger} onClick={toggleMenu}/>

        <ul className={isMenuOpen ? styles.navMenu : `${styles.navMenu} ${styles.hidden}`}>
          <li>
            <Link className={styles.navLinks} to={'/aboutus'} onClick={toggleMenu}>
              {'About Us'}
            </Link>
          </li>
          <li>
            <Link className={styles.navLinks} to={'/ourwork'} onClick={toggleMenu}>
              {'Our Work'}
            </Link>
          </li>
          <li>
            <Link className={styles.navLinks + ' ' + styles.applyDropdownButton} to={'/apply/student'} onClick={toggleMenu}>
              Apply
            </Link>
            <div
              className={ `${styles.applyDropdownContainer} ${styles.menuOpen}`}
            >
              <ul className={styles.applyDropdownContent}>
                <li>
                  <Link className={styles.navLinks} to={'/apply/student'} onClick={toggleMenu}>
                    {'For Students'}
                  </Link>
                </li>
                <li>
                  <Link className={styles.navLinks} to={'/apply/nonprofit'} onClick={toggleMenu}>
                    {'For Nonprofits'}
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <a className={styles.navLinks} href={'mailto:umd@hack4impact.org'}>
              {'Contact Us'}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
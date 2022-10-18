import React, { useState } from 'react';
import Hamburger from '../assets/hamburger_icon.svg';
import styles from '../../styles/navbar/Navbar.module.css';
import h4iLogo from '../assets/h4i_files/h4i_logo.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <div className={isMenuOpen ? styles.blurOverlay : `${styles.blurOverlay} ${styles.hidden}`}></div>
      <nav className={styles.navbarItems}>
        <Link to="/">
          <img alt="Hack4Impact Logo" className={styles.logo} src={h4iLogo}></img>
        </Link>
        <img className={styles.navIcon} src={Hamburger} onClick={toggleMenu}/>

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
            {/* <a className={styles.navLinks} href={'mailto:umd@hack4impact.org'}>
              {'Contact Us'}
            </a> */}
            <Link className={styles.navLinks} to={'/contactus'} onClick={toggleMenu}>
              {'Contact Us'}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

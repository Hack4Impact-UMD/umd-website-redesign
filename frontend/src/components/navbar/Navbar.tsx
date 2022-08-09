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

  //menu-icon is for later use for mobile implementation
  return (
    <div>
      <div className={isMenuOpen ? styles.blurOverlay : ''}></div>
      <nav className={styles.navbarItems}>
        <Link to="/">
          <img alt="Hack4Impact Logo" className={styles.logo} src={h4iLogo}></img>
        </Link>
        <img className={styles.navIcon} src={Hamburger} onClick={toggleMenu}></img>
        <ul className={isMenuOpen ? styles.navMenuActive : styles.navMenu}>
          <li>
            <Link className={styles.navLinks} to={'/aboutus'}>
              {'About Us'}
            </Link>
          </li>
          <li>
            <Link className={styles.navLinks} to={'/ourwork'}>
              {'Our Work'}
            </Link>
          </li>
          <li>
            <Link className={styles.navLinks + ' ' + styles.applyDropdownButton} to={'/apply/student'}>
              Apply
            </Link>
            <div
              className={
                isMenuOpen ? `${styles.applyDropdownContainer} ${styles.menuOpen}` : styles.applyDropdownContainer
              }
            >
              <ul className={styles.applyDropdownContent}>
                <li>
                  <Link className={styles.navLinks} to={'/apply/student'}>
                    {'For Students'}
                  </Link>
                </li>
                <li>
                  <Link className={styles.navLinks} to={'/apply/nonprofit'}>
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

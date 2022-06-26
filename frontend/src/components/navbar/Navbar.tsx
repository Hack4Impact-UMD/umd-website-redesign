import React, { useState } from 'react';
import styles from '../../styles/navbar/Navbar.module.css';
import h4iLogo from '../assets/logo.svg';
import Hamburger from '../assets/hamburger_icon.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [currState, setState] = useState(false);

  const handleState = () => {
    setState(!currState);
  };

  //menu-icon is for later use for mobile implementation
  return (
    <div className={styles.navbarItems}>
      <Link to="/">
        <img className={styles.logo} src={h4iLogo}></img>
      </Link>
      <img className={styles.menuIcon} src={Hamburger} onClick={handleState}></img>
      <ul className={currState ? styles.navMenu.active : styles.navMenu}>
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
          <div className={styles.dropdown}>
            <button className={styles.dropdownButton}>Apply</button>
            <div className={styles.dropdownContent}>
              <Link className={styles.navLinks} to={'/apply/students'}>
                {'For Students'}
              </Link>
              <Link className={styles.navLinks} to={'/apply/nonprofits'}>
                {'For Nonprofits'}
              </Link>
            </div>
          </div>
        </li>
        <li>
          <Link className={styles.navLinks} to={'mailto:umd@hack4impact.org'}>
            {'Contact Us'}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

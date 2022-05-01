import React, { Component, useState } from 'react'
import { MenuItems } from './MenuItems'
import styles from '../../styles/navbar/Navbar.module.css'
import h4iLogo from '../assets/logo.svg';

const Navbar = () => {

    const[currState, setState] = useState(false);

    const handleState = () => {
        setState(!currState);
    }
        //Map will go through each component and present them in a list  (sets up the alignment)

        //menu-icon is for later use for mobile implementation
        return(
            <nav className={styles.navbarItems}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <h1 className="navbar-logo"></h1>
                <img className={styles.logo} src={h4iLogo}></img>
                <div className={styles.menuIcon} onClick={handleState}> 
                    <i className={currState ? styles.faTimes : styles.faBars}></i>
                    
                </div>
                <ul className={currState ? styles.navMenu.active : styles.navMenu}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <a className={styles.navLinks} href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        )
                    })}

                </ul>
            </nav>
        )
    
}

export default Navbar
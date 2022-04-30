import React, { Component, useState } from 'react'
import { MenuItems } from "./MenuItems"
import './Navbar.css'
import h4iLogo from './logo.svg';

const Navbar = () => {

    const[currState, setState] = useState(false);

    const handleState = () => {
        setState(!currState);
    }
        //Map will go through each component and present them in a list  (sets up the alignment)

        //menu-icon is for later use for mobile implementation
        return(
            <nav className="NavbarItems">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <h1 className="navbar-logo"></h1>
                <img className="logo" src={h4iLogo}></img>
                <div className="menu-icon" onClick={handleState}> 
                    <i className={currState ? 'fa fa-times' : 'fa fa-bars'}></i>
                    
                </div>
                <ul className={currState ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={item.cName}>
                                <a className={item.cName} href={item.url}>
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
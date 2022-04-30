import React, { Component } from 'react'
import { MenuItems } from "./MenuItems"
import './Navbar.css'
import h4iLogo from './logo.svg';

class Navbar extends Component {

    render(){
        //Map will go through each component and present them in a list  (sets up the alignment)

        //menu-icon is for later use for mobile implementation
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo"></h1>
                <div className="menu-icon"> 
                    <img className="logo" src={h4iLogo}></img>
                </div>
                <ul className={"nav-menu"}>
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
}

export default Navbar
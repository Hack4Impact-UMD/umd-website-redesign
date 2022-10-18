import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/contact/Contact.module.css';
import MessageSent from './MessageSent';

function ContactPage() {
    const [sent, setSent] = useState(false);
    
    return sent?<MessageSent/>:(
        <div id={styles.headerDiv}>
            <div id={styles.headerContent}>
                <h1 id={styles.title}>Contact Us</h1>
                <form action="">
                    <p>
                    <label>First Name</label>
                    <input type="text"/>
                    </p>
                    <p>
                    <label>Last Name</label>
                    <input type="text"/>
                    </p>
                    <p>
                    <label>Subject</label>
                    <input type="text"/>
                    </p>
                    <p>
                    <label>Email Address</label>
                    <input type="text"/>
                    </p>
                    <p>
                    <label>Phone Number</label>
                    <input type="text"/>
                    </p>
                    <p>
                    <label>Your message</label>
                    <textarea name="" id=""></textarea>
                    </p>
                    <div className={styles.buttonHolder}>
                        <input type="submit" value="Send Message" onClick={()=>setSent(true)}></input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactPage;
import { STATES } from 'mongoose';
import React, { useState } from 'react';
import { InferTypeNode } from 'typescript';
import styles from '../styles/contact/Contact.module.css';
import MessageSent from './MessageSent';

function ContactPage() {
    const [sent, setSent] = useState(false);
    const state = {
        fname: "",
        lname: "",
        subject: "",
        email: "",
        phone: "",
        text: ""
    }
    const handleChange = (e: React.FormEvent<HTMLInputElement>|React.FormEvent<HTMLTextAreaElement>) => {
        const { value, name } = e.currentTarget;
        state[name as keyof typeof state] = value;
    };
    function submitValid() {
        return state.fname && state.lname && state.subject && state.email && state.phone && state.text;
    }

    return sent?<MessageSent/>:(
        <div id={styles.headerDiv}>
            <div id={styles.headerContent}>
                <h1 id={styles.title}>Contact Us</h1>
                <form action="">
                    <p>
                    <label>First Name</label>
                    <input type="text" name="fname" onChange={handleChange} required/>
                    </p>
                    <p>
                    <label>Last Name</label>
                    <input type="text" name="lname" onChange={handleChange} required/>
                    </p>
                    <p>
                    <label>Subject</label>
                    <input type="text" name="subject" onChange={handleChange} required/>
                    </p>
                    <p>
                    <label>Email Address</label>
                    <input type="text" name="email" onChange={handleChange} required/>
                    </p>
                    <p>
                    <label>Phone Number</label>
                    <input type="text" name="phone" onChange={handleChange} required/>
                    </p>
                    <p>
                    <label>Your message</label>
                    <textarea name="text" onChange={handleChange} required></textarea>
                    </p>
                    <div className={styles.buttonHolder}>
                        <input type="submit" value="Send Message" onClick={()=>{submitValid()&&setSent(true)}}></input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactPage;
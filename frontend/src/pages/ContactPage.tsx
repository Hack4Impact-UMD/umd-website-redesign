import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertTypeAcquisitionFromJson, formatDiagnostic } from 'typescript';
import styles from '../styles/contact/Contact.module.css';
import MessageSent from './MessageSent';

function ContactPage() {
    const [sent, setSent] = useState(false);
    const [contactInfo] = useState({
        firstName: '',
        lastName: '',
        subject: '',
        email: '',
        phoneNumber: '',
        message: '',
    });

    function updateInfo(event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) {
        const formProp = event.currentTarget
        if (formProp.id == "firstName") {
            contactInfo.firstName = formProp.value;
        } else if (formProp.id == "lastName") {
            contactInfo.lastName = formProp.value;
        } else if (formProp.id == "subject") {
            contactInfo.subject = formProp.value;
        } else if (formProp.id == "email") {
            contactInfo.email = formProp.value;
        } else if (formProp.id == "phoneNumber") {
            contactInfo.phoneNumber = formProp.value;
        } else if (formProp.id == "message") {
            contactInfo.message = formProp.value;
        }
    }

    function validateForm(event: React.FormEvent<HTMLFormElement>) {
        console.log(contactInfo)
        const verifyEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const verifyPhoneNumberCaseOne= /^[0-9]{10}$/;
        const verifyPhoneNumberCaseTwo = /^[0-9]{3} [0-9]{3} [0-9]{4}$/;
        const verifyPhoneNumberCaseThree = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

        if (contactInfo.firstName === '' || contactInfo.lastName === ''|| contactInfo.subject === '' 
            || contactInfo.email === '' || contactInfo.phoneNumber === ''|| contactInfo.message === '') {
            
           event.preventDefault();
           alert("contact information is empty")
           return false;
        }

        if (!verifyEmail.test(contactInfo.email)) {
            event.preventDefault();
            alert("Email is invalid")
            return false;
        } 
        if (!verifyPhoneNumberCaseOne.test(contactInfo.phoneNumber) && !verifyPhoneNumberCaseTwo.test(contactInfo.phoneNumber)
            && !verifyPhoneNumberCaseThree.test(contactInfo.phoneNumber)) {
            event.preventDefault();
            alert("Phone number is invalid\nFormat: 0000000000 or 000-000-0000 or 000 000 0000")
            return false;
        }
        
        return true
    }

    return sent?<MessageSent/>:(
        <div id={styles.headerDiv}>
            <div id={styles.headerContent}>
                <h1 id={styles.title}>Contact Us</h1>
                <form action="https://formsubmit.co/" onSubmit={validateForm} method='POST'>
                    <div>
                    <label>First Name</label>
                    <input  type="text" id="firstName" name="firstName" onChange={updateInfo}/>
                    </div>
                    <div>
                    <label>Last Name</label>
                    <input type="text" id="lastName" name="lastName" onChange={updateInfo}/>
                    </div>
                    <div>
                    <label>Subject</label>
                    <input type="text" id="subject" name="subject" onChange={updateInfo}/>
                    </div>
                    <div>
                    <label>Email Address</label>
                    <input type="text" id="email" name="email" onChange={updateInfo}/>
                    </div>
                    <div>
                    <label>Phone Number</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" onChange={updateInfo}/>
                    </div>
                    <div>
                    <label>Your message</label>
                    <textarea name="message" id="message" onChange={updateInfo}></textarea>
                    </div>
                    <div className={styles.buttonHolder}>
                        <input type="submit" value="Send Message"></input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactPage;
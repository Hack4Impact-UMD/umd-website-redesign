import React, { useState } from 'react';
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

  const handleChange = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.currentTarget;
    contactInfo[name as keyof typeof contactInfo] = value;
  };

  function updateInfo(event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) {
    const formProp = event.currentTarget;
    if (formProp.id == 'firstName') {
      contactInfo.firstName = formProp.value;
    } else if (formProp.id == 'lastName') {
      contactInfo.lastName = formProp.value;
    } else if (formProp.id == 'subject') {
      contactInfo.subject = formProp.value;
    } else if (formProp.id == 'email') {
      contactInfo.email = formProp.value;
    } else if (formProp.id == 'phoneNumber') {
      contactInfo.phoneNumber = formProp.value;
    } else if (formProp.id == 'message') {
      contactInfo.message = formProp.value;
    }
  }

  function validateForm(event: React.FormEvent<HTMLFormElement>) {
    console.log(contactInfo);
    const verifyEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const verifyPhoneNumberCaseOne = /^[0-9]{10}$/;
    const verifyPhoneNumberCaseTwo = /^[0-9]{3} [0-9]{3} [0-9]{4}$/;
    const verifyPhoneNumberCaseThree = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

    if (
      contactInfo.firstName === '' ||
      contactInfo.lastName === '' ||
      contactInfo.subject === '' ||
      contactInfo.email === '' ||
      contactInfo.phoneNumber === '' ||
      contactInfo.message === ''
    ) {
      event.preventDefault();
      alert('contact information is empty');
      return false;
    }

    if (!verifyEmail.test(contactInfo.email)) {
      event.preventDefault();
      alert('Email is invalid');
      return false;
    }
    if (
      !verifyPhoneNumberCaseOne.test(contactInfo.phoneNumber) &&
      !verifyPhoneNumberCaseTwo.test(contactInfo.phoneNumber) &&
      !verifyPhoneNumberCaseThree.test(contactInfo.phoneNumber)
    ) {
      event.preventDefault();
      alert('Phone number is invalid\nFormat: 0000000000 or 000-000-0000 or 000 000 0000');
      return false;
    }
    console.log('valiated');
    return true;
  }

  return sent ? (
    <MessageSent />
  ) : (
    <div id={styles.headerDiv}>
      <div id={styles.headerContent}>
        <h1 id={styles.title}>Contact Us</h1>
        <form
          action="https://formsubmit.co/sgaba@terpmail.umd.edu"
          onSubmit={(form) => {
            form.preventDefault();
            setSent(true);
            validateForm(form);
          }}
          method="POST"
        >
          <div>
            <label>First Name</label>
            <input type="text" name="firstName" onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" name="lastName" onChange={handleChange} required />
          </div>

          <p>
            <label>Subject</label>
            <input type="text" name="subject" onChange={handleChange} required />
          </p>
          <p>
            <label>Email Address</label>
            <input type="text" name="email" onChange={handleChange} required />
          </p>
          <p>
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" onChange={handleChange} required />
          </p>
          <p>
            <label>Your message</label>
            <textarea name="message" onChange={handleChange} required></textarea>
          </p>
          <div className={styles.buttonHolder}>
            <button type="submit" value="Send Message"></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;

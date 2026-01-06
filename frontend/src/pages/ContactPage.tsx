import emailjs from '@emailjs/browser';
import React, { useState } from 'react';
import styles from '../styles/contact/Contact.module.css';
import MessageSent from './MessageSent';

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    subject: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const handleChange = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.currentTarget;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function validateForm(event: React.FormEvent<HTMLFormElement>) {
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

    // TODO: Move these to environment variables for security
    // VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_rux8luc';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_fgd74qw';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'oqfPTswPuNLGMxG8o';

    await emailjs
      .send(serviceId, templateId, contactInfo, {
        publicKey: publicKey,
      })
      .then(
        () => {
          setSent(true);
          console.log('SUCCESS!');
        },
        (error: any) => {
          console.log('FAILED...', error);
        },
      );
    return true;
  }

  return sent ? (
    <MessageSent />
  ) : (
    <div id={styles.headerDiv}>
      <div id={styles.headerContent}>
        <h1 id={styles.title}>Contact Us</h1>
        <form
          onSubmit={(form) => {
            form.preventDefault();
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
            <button type="submit" value="Send Message" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;

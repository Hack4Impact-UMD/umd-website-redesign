import emailjs from '@emailjs/browser';
import React, { useState } from 'react';
import styles from './Contact.module.css';
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
  console.log(process.env.PUBLIC_KEY);

  async function validateForm(event: React.FormEvent<HTMLFormElement>) {
    console.log(contactInfo);
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

    await emailjs
      .send('service_rux8luc', 'template_fgd74qw', contactInfo, {
        publicKey: 'oqfPTswPuNLGMxG8o',
      })
      .then(
        () => {
          setSent(true);
          console.log('SUCCESS!');
        },
        (error) => {
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
          className={styles.form}
        >
          <div>
            <label>First Name</label>
            <input type="text" name="firstName" onChange={handleChange} required className={styles.input} />
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" name="lastName" onChange={handleChange} required className={styles.input} />
          </div>

          <p>
            <label>Subject</label>
            <input type="text" name="subject" onChange={handleChange} required className={styles.input} />
          </p>
          <p>
            <label>Email Address</label>
            <input type="text" name="email" onChange={handleChange} required className={styles.input} />
          </p>
          <p>
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" onChange={handleChange} required className={styles.input} />
          </p>
          <p>
            <label>Your message</label>
            <textarea name="message" onChange={handleChange} required className={styles.textArea}></textarea>
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

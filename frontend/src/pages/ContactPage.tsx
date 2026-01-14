import emailjs from '@emailjs/browser';
import React, { useState } from 'react';
import styles from '../styles/contact/Contact.module.css';
import MessageSent from './MessageSent';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  SEND_FAILED: 'Failed to send message. Please try again later.',
} as const;

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    subject: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.currentTarget;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const hasEmptyFields = Object.values(contactInfo).some((value) => !value.trim());
    if (hasEmptyFields) {
      setError(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    if (!EMAIL_REGEX.test(contactInfo.email)) {
      setError(ERROR_MESSAGES.INVALID_EMAIL);
      return;
    }

    setIsSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS configuration missing');
      setError('Email service not configured. Please contact support.');
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.send(serviceId, templateId, contactInfo, { publicKey });
      setSent(true);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(ERROR_MESSAGES.SEND_FAILED);
      setIsSubmitting(false);
    }
  };

  return sent ? (
    <MessageSent />
  ) : (
    <div id={styles.headerDiv}>
      <div id={styles.headerContent}>
        <h1 id={styles.title}>Contact Us</h1>
        {error && (
          <div role="alert" className={styles.errorMessage}>
            {error}
          </div>
        )}
        <form onSubmit={validateForm} method="POST" noValidate>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              autoComplete="given-name"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              autoComplete="family-name"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              autoComplete="email"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              onChange={handleChange}
              autoComplete="tel"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="message">Your message</label>
            <textarea
              id="message"
              name="message"
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className={styles.buttonHolder}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;

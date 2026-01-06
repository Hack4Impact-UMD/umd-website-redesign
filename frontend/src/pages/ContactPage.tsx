import emailjs from '@emailjs/browser';
import React, { useState } from 'react';
import styles from '../styles/contact/Contact.module.css';
import MessageSent from './MessageSent';

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

  const handleChange = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.currentTarget;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  async function validateForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Check for empty fields
    if (
      !contactInfo.firstName.trim() ||
      !contactInfo.lastName.trim() ||
      !contactInfo.subject.trim() ||
      !contactInfo.email.trim() ||
      !contactInfo.phoneNumber.trim() ||
      !contactInfo.message.trim()
    ) {
      setError('Please fill in all required fields.');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    setIsSubmitting(true);

    // TODO: Move these to environment variables for security
    // VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_rux8luc';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_fgd74qw';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'oqfPTswPuNLGMxG8o';

    try {
      await emailjs.send(serviceId, templateId, contactInfo, {
        publicKey: publicKey,
      });
      setSent(true);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again later.');
      setIsSubmitting(false);
    }

    return true;
  }

  return sent ? (
    <MessageSent />
  ) : (
    <div id={styles.headerDiv}>
      <div id={styles.headerContent}>
        <h1 id={styles.title}>Contact Us</h1>
        {error && (
          <div
            role="alert"
            style={{
              color: '#F2594B',
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#FFE5E5',
              borderRadius: '4px',
              border: '1px solid #F2594B',
            }}
          >
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
            ></textarea>
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

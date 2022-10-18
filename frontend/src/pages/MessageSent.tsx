import React from 'react';
import styles from '../styles/contact/MessageSent.module.css';

function MessageSent() {
  return (
    <div id={styles.headerDiv}>
        <div className={styles.MessageSent}><h1>Contact Us</h1></div>
        <div className={styles.body}>
            <p><b>Message sent!</b></p>
            <p>We will be in touch with you as soon as possible.</p>
        </div>
    </div>
  );
}

export default MessageSent;
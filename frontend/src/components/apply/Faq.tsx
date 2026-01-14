import React, { useState } from 'react';
import styles from '../../styles/apply/Faq.module.css';
import Arrow from '../assets/faq_arrow.svg?react';

interface FaqProps {
  children: React.ReactNode;
}

export default function Faq({ children }: FaqProps) {
  return (
    <div className={styles.faq}>
      <h2 className={styles.header}>Frequently Asked Questions</h2>
      {children}
    </div>
  );
}

interface FaqRowProps {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export function FaqRow({ question, answer }: FaqRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqRow}>
      <button
        className={styles.question}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        type="button"
      >
        {question}
        <div className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}>
          <Arrow aria-hidden="true" />
        </div>
      </button>
      <div
        className={`${styles.answer} ${isOpen ? styles.showing : ''}`}
        role="region"
        aria-hidden={!isOpen}
      >
        {answer}
      </div>
    </div>
  );
}

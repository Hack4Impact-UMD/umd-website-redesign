import React, { useState } from 'react';
import styles from '../../styles/apply/Faq.module.css';
import Arrow from '../assets/faq_arrow.svg?react';

export default function Faq(props: { children: React.ReactNode }) {
  return (
    <div className={styles.faq}>
      <h2 className={styles.header}>Frequently Asked Questions</h2>
      {props.children}
    </div>
  );
}

type RowProps = {
  question: React.ReactNode;
  answer: React.ReactNode;
};

/*
 * To be used with Faq.
 * Props:
 * question (JSX): JSX Input containing a <p>
 * answer (JSX): JSX Input containing a <p>
 */
export function FaqRow({ question, answer }: RowProps) {
  const [showing, setShowing] = useState(false);

  const toggleShowAnswer = () => {
    setShowing(!showing);
  };

  return (
    <div className={styles.faqRow}>
      <div className={styles.question} onClick={toggleShowAnswer}>
        {question}
        <div className={showing ? `${styles.arrow} ${styles.rotated}` : styles.arrow}>
          <Arrow />
        </div>
      </div>
      <div className={showing ? `${styles.answer} ${styles.showing}` : styles.answer}>
        {answer}
      </div>
    </div>
  );
}

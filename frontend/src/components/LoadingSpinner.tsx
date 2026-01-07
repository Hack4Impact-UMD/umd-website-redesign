import React from 'react';
import styles from '../styles/LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>{text}</p>
    </div>
  );
};

export default LoadingSpinner;

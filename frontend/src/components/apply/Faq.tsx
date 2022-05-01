import React from 'react';
import styles from '../../styles/apply/Faq.module.css';
import { ReactComponent as Arrow } from '../assets/faq_arrow.svg';

export default function Faq(props: any) {
  return (
    <div className={styles.faq}>
      <p className={styles.header}>Frequently Asked Questions</p>
      {props.children}
    </div>
  );
}

type RowProps = {
  question: React.ReactNode;
  answer: React.ReactNode;
};

type RowState = {
  showing: boolean;
};

/*
 * To be used with Faq.
 * Props:
 * question (JSX): JSX Input containing a <p>
 * answer (JSX): JSX Input containing a <p>
 */
export class FaqRow extends React.Component<RowProps, RowState> {
  constructor(props: RowProps) {
    super(props);
    this.state = {
      /* True if the answer is showing, false otherwise */
      showing: false,
    };

    this.toggleShowAnswer = this.toggleShowAnswer.bind(this);
  }

  toggleShowAnswer() {
    this.setState({ showing: !this.state.showing });
  }

  render() {
    return (
      <div className={styles.faqRow}>
        <div className={styles.question} onClick={this.toggleShowAnswer}>
          {this.props.question}
          <div className={this.state.showing ? `${styles.arrow} ${styles.rotated}` : styles.arrow}>
            <Arrow />
          </div>
        </div>
        <div className={this.state.showing ? `${styles.answer} ${styles.showing}` : styles.answer}>
          {this.props.answer}
        </div>
      </div>
    );
  }
}

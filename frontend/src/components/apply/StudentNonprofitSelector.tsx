import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/apply/StudentNonprofitSelector.module.css';

/* Import as SVG to allow for animation */
import { ReactComponent as StudentGreyDesktop } from '../assets/selector/student_grey_desktop.svg';
import studentBlueDesktop from '../assets/selector/student_blue_desktop.svg';
import studentGreyMobile from '../assets/selector/student_grey_mobile.svg';
import studentBlueMobile from '../assets/selector/student_blue_mobile.svg';

import { ReactComponent as NonprofitGreyDesktop } from '../assets/selector/nonprofit_grey_desktop.svg';
import nonprofitBlueDesktop from '../assets/selector/nonprofit_blue_desktop.svg';
import nonprofitGreyMobile from '../assets/selector/nonprofit_grey_mobile.svg';
import nonprofitBlueMobile from '../assets/selector/nonprofit_blue_mobile.svg';

/*
 * Props:
 * curr (string): "student" if on apply page for students, "nonprofit" if on
 * apply page for nonprofits.
 */
function StudentNonprofitSelector(props: any) {
  let studentMobile: React.ReactNode;
  let nonprofitMobile: React.ReactNode;
  let studentDesktop: React.ReactNode;
  let nonprofitDesktop: React.ReactNode;
  if (props.curr == 'student') {
    studentMobile = <img src={studentBlueMobile} />;
    nonprofitMobile = <img src={nonprofitGreyMobile} />;
    studentDesktop = <img src={studentBlueDesktop} />;
    nonprofitDesktop = (
      <div className={styles.greyDesktop}>
        <NonprofitGreyDesktop />
      </div>
    );
  } else {
    studentMobile = <img src={studentGreyMobile} />;
    nonprofitMobile = <img src={nonprofitBlueMobile} />;
    studentDesktop = (
      <div className={styles.greyDesktop}>
        <StudentGreyDesktop />
      </div>
    );
    nonprofitDesktop = <img src={nonprofitBlueDesktop} />;
  }

  return (
    <div className={styles.studentNonprofitSelector}>
      <div className={styles.mobile}>
        <Link to="/apply/student">{studentMobile}</Link>
        <Link to="/apply/nonprofit">{nonprofitMobile}</Link>
      </div>
      <div className={styles.desktop}>
        <Link to="/apply/student">{studentDesktop}</Link>
        <Link to="/apply/nonprofit">{nonprofitDesktop}</Link>
      </div>
    </div>
  );
}

export default StudentNonprofitSelector;

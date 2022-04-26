import React from 'react';
import styles from './StudentNonprofitSelector.module.css';

import studentBlueDesktop from './assets/selector/student_blue_desktop.svg';
import studentBlueMobile from './assets/selector/student_blue_mobile.svg';
import studentGreyDesktop from './assets/selector/student_grey_desktop.svg';
import studentGreyMobile from './assets/selector/student_grey_mobile.svg';
import nonprofitBlueDesktop from './assets/selector/nonprofit_blue_desktop.svg';
import nonprofitBlueMobile from './assets/selector/nonprofit_blue_mobile.svg';
import nonprofitGreyDesktop from './assets/selector/nonprofit_grey_desktop.svg';
import nonprofitGreyMobile from './assets/selector/nonprofit_grey_mobile.svg';

/* TODO: add links */

/*
 * Props:
 * curr (string): "student" if on apply page for students, "nonprofit" if on
 * apply page for nonprofits.
 */
function StudentNonprofitSelector(props: any) {
  let studentMobile: string;
  let nonprofitMobile: string;
  let studentDesktop: string;
  let nonprofitDesktop: string;
  if (props.curr == 'student') {
    studentMobile = studentBlueMobile;
    studentDesktop = studentBlueDesktop;
    nonprofitMobile = nonprofitGreyMobile;
    nonprofitDesktop = nonprofitGreyDesktop;
  } else {
    studentMobile = studentGreyMobile;
    studentDesktop = studentGreyDesktop;
    nonprofitMobile = nonprofitBlueMobile;
    nonprofitDesktop = nonprofitBlueDesktop;
  }

  return (
    <div className={styles.studentNonprofitSelector}>
      <div className={styles.mobile}>
        <img src={studentMobile} />
        <img src={nonprofitMobile} />
      </div>
      <div className={styles.desktop}>
        <img src={studentDesktop} />
        <img src={nonprofitDesktop} />
      </div>
    </div>
  );
}

export default StudentNonprofitSelector;

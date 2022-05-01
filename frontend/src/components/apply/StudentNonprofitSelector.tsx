import React from 'react';
import styles from '../../styles/apply/StudentNonprofitSelector.module.css';

import studentBlueDesktop from '../assets/selector/student_blue_desktop.svg';
import studentBlueMobile from '../assets/selector/student_blue_mobile.svg';
import studentGreyDesktop from '../assets/selector/student_grey_desktop.svg';
import studentGreyMobile from '../assets/selector/student_grey_mobile.svg';
import nonprofitBlueDesktop from '../assets/selector/nonprofit_blue_desktop.svg';
import nonprofitBlueMobile from '../assets/selector/nonprofit_blue_mobile.svg';
import nonprofitGreyDesktop from '../assets/selector/nonprofit_grey_desktop.svg';
import nonprofitGreyMobile from '../assets/selector/nonprofit_grey_mobile.svg';

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
  let studentClass: string;
  let nonprofitClass: string;
  if (props.curr == 'student') {
    studentMobile = studentBlueMobile;
    studentDesktop = studentBlueDesktop;
    nonprofitMobile = nonprofitGreyMobile;
    nonprofitDesktop = nonprofitGreyDesktop;
    studentClass = styles.blueButton
    nonprofitClass = styles.greyButton
  } else {
    studentMobile = studentGreyMobile;
    studentDesktop = studentGreyDesktop;
    nonprofitMobile = nonprofitBlueMobile;
    nonprofitDesktop = nonprofitBlueDesktop;
    studentClass = styles.greyButton
    nonprofitClass = styles.blueButton
  }

  return (
    <div className={styles.studentNonprofitSelector}>
      <div className={styles.mobile}>
        <img src={studentMobile} className={studentClass}/>
        <img src={nonprofitMobile} className={nonprofitClass}/>
      </div>
      <div className={styles.desktop}>
        <img src={studentDesktop} className={studentClass}/>
        <img src={nonprofitDesktop} className={nonprofitClass}/>
      </div>
    </div>
  );
}

export default StudentNonprofitSelector;

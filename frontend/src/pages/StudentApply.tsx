import React from 'react';
import styles from './StudentApply.module.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import RoleCard from '../components/apply/RoleCard';
import StudentNonprofitSelector from '../components/apply/StudentNonprofitSelector';
import ApplyButton from '../components/apply/ApplyButton';
import Faq, { FaqRow } from '../components/apply/Faq';

import oneIcon from './assets/one_icon.svg';
import twoIcon from './assets/two_icon.svg';
import threeIcon from './assets/three_icon.svg';
import oneIconDesktop from './assets/one_icon_desktop.svg';
import twoIconDesktop from './assets/two_icon_desktop.svg';
import threeIconDesktop from './assets/three_icon_desktop.svg';

function StudentApply() {
  return (
    <div className={styles.studentApply}>
      <Navbar />
      <StudentApplyHeader />
      <StudentApplyCards />
      <ApplicationTimeline />
      <div className={styles.applyButton}>
        <ApplyButton />
      </div>
      <div className={styles.faq}>
        <FaqSection />
      </div>
      <div className={styles.footerDiv}>
        <Footer />
      </div>
    </div>
  );
}

function StudentApplyHeader() {
  return (
    <div className={styles.studentApplyHeader}>
      <div className={styles.studentApplyHeaderContent}>
        <h1>Apply</h1>
        <StudentNonprofitSelector curr={'student'} />
        <h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris dolore magna aliqua.
        </h2>
      </div>
    </div>
  );
}

function StudentApplyCards() {
  const summary =
    'Short summary about the role and its responsibilities. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.';

  return (
    <div className={styles.studentApplyCards}>
      <RoleCard mainText={'Engineer'} hoverText={summary} role={1} />
      <RoleCard mainText={'Designer'} hoverText={summary} revBackground={true} role={2} />
      <RoleCard mainText={'Project Manager'} hoverText={summary} role={3} />
      <RoleCard mainText={'Tech Lead'} hoverText={summary} revBackground={true} role={4} />
      <RoleCard mainText={'Bootcamp'} hoverText={summary} role={5} />
    </div>
  );
}

function ApplicationTimeline() {
  const summary =
    'Short summary. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.';

  return (
    <div className={styles.timeline}>
      <h1>Application Timeline</h1>
      <div className={styles.timelineStep}>
        <img src={oneIcon} className={styles.mobileTimelineIcon} />
        <img src={oneIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h2>Application</h2>
          <p>{summary}</p>
        </div>
      </div>
      <div className={styles.timelineStep}>
        <img src={twoIcon} className={styles.mobileTimelineIcon} />
        <img src={twoIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h2>Interview</h2>
          <p>{summary}</p>
        </div>
      </div>
      <div className={styles.timelineStep}>
        <img src={threeIcon} className={styles.mobileTimelineIcon} />
        <img src={threeIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h2>Notification of Decision</h2>
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <Faq>
      <FaqRow
        question={<p>How much of a time commitment is Hack4Impact?</p>}
        answer={
          <p>
            Most students spend about 3 hours per week on Hack4Impact project work. Each project team determines their
            own schedule, but most meet for about 1 hour per week to plan and delegate tasks. The other time is spent
            working on the project individually. <br /> <br />
            We also hold general body meetings every week, which are about 1 hour long. H4I holds many other events
            during the year, such as volunteer events, tech talks, and social events. These events are not mandatory,
            but we highly encourage our members to attend. <br /> <br /> Leadership roles, such as executive directors,
            project managers, and tech leads will spend more time, up to 10 hours a week.{' '}
          </p>
        }
      />
      <FaqRow question={<p>Do I need any prior technical experience before applying?</p>} answer={<p>No.</p>} />
      <FaqRow question={<p>What tech stack is used in your projects?</p>} answer={<p>MERN</p>} />
      <FaqRow question={<p>How many members are in Hack4Impact?</p>} answer={<p>1</p>} />
    </Faq>
  );
}

export default StudentApply;

import React from 'react';
import styles from '../styles/apply/StudentApply.module.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import RoleCard from '../components/apply/RoleCard';
import StudentNonprofitSelector from '../components/apply/StudentNonprofitSelector';
import Faq, { FaqRow } from '../components/apply/Faq';
import GreenButton from '../components/buttons/GreenButton';


import oneIcon from '../components/assets/one_icon.svg';
import twoIcon from '../components/assets/two_icon.svg';
import threeIcon from '../components/assets/three_icon.svg';
import oneIconDesktop from '../components/assets/one_icon_desktop.svg';
import twoIconDesktop from '../components/assets/two_icon_desktop.svg';
import threeIconDesktop from '../components/assets/three_icon_desktop.svg';

function StudentApply() {
  return (
    <div className={styles.studentApply}>
      {/* <Navbar /> */}
      <StudentApplyHeader />
      <StudentApplyCards />
      <ApplicationTimeline />
      <div className={styles.applyButton}>
        <GreenButton text={"Apply"} link={'https://docs.google.com/forms/d/e/1FAIpQLSdJELnXgIjk8KNtJn2N5u1j3mnZBzhVQpwCITNetFpo0UIMmQ/viewform?usp=sf_link'}/>
      </div>
      <div className={styles.faq}>
        <FaqSection />
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
        We strive to prepare students for socially conscious roles in tech while creating a supportive community. At Hack4Impact-UMD, students have the opportunity to develop real-world skills such as understanding the Agile methodology and working with team members like product managers, UI/UX designers, tech leads, and engineers.
        </h2>
      </div>
    </div>
  );
}

function StudentApplyCards() {
  const summary =
    'Short summary about the role and its responsibilities. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.';

  const engineerSummary = 'The Engineers implement the technical aspects of the product; they are expected to complete tasks for each sprint. Their work focuses on coding the features of the product.'

  const designerSummary = 'The UI/UX Designer develops the frontend designs for the product and meets with the nonprofit partner to incorporate their input and needs into the design. They also provide feedback to the engineers as they implement the designs.'

  const projectManagerSummary = "The Product Manager (PM) scopes out the product and develops the team's timeline. They are the main point of contact with the nonprofit partner and meet with them weekly to discuss updates to the product. The PM creates sprints and holds the team's week standup meetings to check in with their engineers and designers to assign their tasks."

  const techLeadSummary = 'The Tech Lead for each team is the designated technical expert and helps the engineers with any tech-related questions. In addition to completing engineer tasks, their responsibilities include scoping the technical aspects of the product and creating engineer tasks with the product managers.'

  const bootcampSummary = 'Bootcamp teaches members the necessary skillset to join a project team and is for students with less experience. In Bootcamp, students learn web development skills starting from basic HTML, JavaScript, and CSS and then building up to the MERN (MongoDB, Express, React, Node.js) stack. The goal is for members to complete Bootcamp and then join a project team the following semester.'

  return (
    <div className={styles.studentApplyCards}>
      <RoleCard mainText={'Engineer'} hoverText={engineerSummary} role={1} />
      <RoleCard mainText={'Designer'} hoverText={designerSummary} revBackground={true} role={2} />
      <RoleCard mainText={'Project Manager'} hoverText={projectManagerSummary} role={3} />
      <RoleCard mainText={'Tech Lead'} hoverText={techLeadSummary} revBackground={true} role={4} />
      <RoleCard mainText={'Bootcamp'} hoverText={bootcampSummary} role={5} />
    </div>
  );
}

function ApplicationTimeline() {
  const summary =
    'Short summary. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.';

  const firstStep = "The written application is the main part of our new member application process. It consists of short essay questions that gauge a candidate's interest and commitment to Hack4Impact-UMD’s mission and goals."

  const secondStep = "The interview focuses on determining if a candidate is a fit for Hack4Impact-UMD. We typically interview applicants joining a project team, and this is a behavioral interview (not a technical interview). If you are selected to interview, a board member will reach out via email with scheduling information."

  const thirdStep = "All candidates will be notified about their application decision via email. The acceptance emails include more information about onboarding. If you were not accepted, we encourage you to reapply the following semester and reach out if you have any questions."

  return (
    <div className={styles.timeline}>
      <h1>Application Timeline</h1>
      <div className={styles.timelineStep}>
        <img src={oneIcon} className={styles.mobileTimelineIcon} />
        <img src={oneIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h2>Application</h2>
          <p>{firstStep}</p>
        </div>
      </div>
      <div className={styles.timelineStep}>
        <img src={twoIcon} className={styles.mobileTimelineIcon} />
        <img src={twoIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h2>Interview</h2>
          <p>{secondStep}</p>
        </div>
      </div>
      <div className={styles.timelineStep}>
        <img src={threeIcon} className={styles.mobileTimelineIcon} />
        <img src={threeIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h2>Notification of Decision</h2>
          <p>{thirdStep}</p>
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
      <FaqRow question={<p>Do I need any prior technical experience before applying?</p>} answer={<p>
        It is not required to know any specific languages, but we do require students who are applying to become developers or product managers to have taken CMSC 131 or have basic programming skills (classes, arrays, maps, etc.) already. General web development skills like HTML, CSS, and JavaScript are also good to know. People with less programming and web development experience will be placed in the bootcamp group, which will allow you to get to know other people in Hack4Impact and improve your web development skills.</p>} />
      <FaqRow question={<p>What tech stack is used in your projects?</p>} answer={<p>We mainly develop new projects on the MERN (MongoDB, Express.js, React, and Node.js) stack. However, we will also help out nonprofit organizations that have existing websites on other stacks, such as Django, Flask, or Ruby on Rails.</p>} />
      {/* <FaqRow question={<p>How many members are in Hack4Impact?</p>} answer={<p>1</p>} /> */}
    </Faq>
  );
}

export default StudentApply;

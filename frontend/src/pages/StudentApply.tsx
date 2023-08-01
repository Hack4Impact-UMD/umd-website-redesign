import React from 'react';
import styles from '../styles/apply/StudentApply.module.css';
import RoleCard from '../components/apply/RoleCard';
import StudentNonprofitSelector from '../components/apply/StudentNonprofitSelector';
import StandardButton from '../components/buttons/StandardButton';
import Faq, { FaqRow } from '../components/apply/Faq';

import oneIcon from '../components/assets/icons/one_icon.svg';
import twoIcon from '../components/assets/icons/two_icon.svg';
import threeIcon from '../components/assets/icons/three_icon.svg';
import oneIconDesktop from '../components/assets/icons/one_icon_desktop.svg';
import twoIconDesktop from '../components/assets/icons/two_icon_desktop.svg';
import threeIconDesktop from '../components/assets/icons/three_icon_desktop.svg';
import { useEffect, useState } from 'react';

function StudentApply() {
  return (
    <div className={styles.studentApply}>
      {/* <Navbar /> */}
      <StudentApplyHeader />
      <StudentApplyCards />
      <ApplicationTimeline />
      <div className={styles.applyButton}>
        <StandardButton color="green" text="Apply" externalLink={true} link="https://bit.ly/apply-h4i-umd" />
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
        <p>
          We strive to prepare students for socially conscious roles in tech while creating a supportive community. At
          Hack4Impact-UMD, students have the opportunity to develop real-world skills such as understanding the Agile
          methodology and working with team members like product managers, UI/UX designers, tech leads, and engineers.
        </p>
      </div>
    </div>
  );
}

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
function StudentApplyCards() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const summary =
    'Short summary about the role and its responsibilities. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.';

  const engineerSummary =
    'The Engineers implement the technical aspects of the product; they are expected to complete tasks for each sprint. Their work focuses on coding the features of the product.';

  const designerSummary =
    'The UI/UX Designer develops the frontend designs for the product and meets with the nonprofit partner to incorporate their input and needs into the design. They also provide feedback to the engineers as they implement the designs.';

  const projectManagerSummary =
    "The Product Manager (PM) scopes out the product and develops the team's timeline. They are the main point of contact with the nonprofit partner and meet with them weekly to discuss updates to the product. The PM creates sprints and holds the team's week standup meetings to check in with their engineers and designers to assign their tasks.";

  const techLeadSummary =
    'The Tech Lead for each team is the designated technical expert and helps the engineers with any tech-related questions. In addition to completing engineer tasks, their responsibilities include scoping the technical aspects of the product and creating engineer tasks with the product managers.';

  const bootcampSummary =
    'Bootcamp teaches members the necessary skillset to join a project team and is for students with less experience. In Bootcamp, students learn web development skills starting from basic HTML, JavaScript, and CSS and then building up to the MERN (MongoDB, Express, React, Node.js) stack. The goal is for members to complete Bootcamp and then join a project team the following semester.';

  const sourcingSummary =
    'The Sourcing committee focuses on securing our projects for the following semester. Members reach out to local nonprofit organizations and communicate the services that Hack4Impact-UMD provides for the community. This role does not require any technical skills and is open to all majors.';

  return (
    <div className={styles.studentApplyCards}>
      <RoleCard mainText={'Engineer'} hoverText={engineerSummary} screenWidth={windowSize.innerWidth} role={1} />
      <RoleCard
        mainText={'Designer'}
        hoverText={designerSummary}
        screenWidth={windowSize.innerWidth}
        revBackground={true}
        role={2}
      />
      <RoleCard
        mainText={'Project Manager'}
        hoverText={projectManagerSummary}
        screenWidth={windowSize.innerWidth}
        role={3}
      />
      <RoleCard
        mainText={'Tech Lead'}
        hoverText={techLeadSummary}
        screenWidth={windowSize.innerWidth}
        revBackground={true}
        role={4}
      />
      <RoleCard mainText={'Bootcamp'} hoverText={bootcampSummary} screenWidth={windowSize.innerWidth} role={5} />
      <RoleCard mainText={'Sourcing'} hoverText={sourcingSummary} screenWidth={windowSize.innerWidth} role={6} />
    </div>
  );
}

function ApplicationTimeline() {
  const summary =
    'Short summary. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.';

  const firstStep =
    "The written application is the main part of our new member application process. It consists of short essay questions that gauge a candidate's interest and commitment to Hack4Impact-UMD’s mission and goals.";

  const secondStep =
    'The interview focuses on determining if a candidate is a fit for Hack4Impact-UMD. We typically interview applicants joining a project team, and this is a behavioral interview (not a technical interview). If you are selected to interview, a board member will reach out via email with scheduling information.';

  const thirdStep =
    'All candidates will be notified about their application decision via email. The acceptance emails include more information about onboarding. If you were not accepted, we encourage you to reapply the following semester and reach out if you have any questions.';

  return (
    <div className={styles.timeline}>
      <h2>Application Timeline</h2>
      <p>
        The Hack4Impact-UMD application process includes a written application and possibly an interview. We recruit new
        members in the Fall and the Spring. Our applications are opened in early August and January and closed before
        the semester starts.
      </p>
      <div className={styles.timelineStep}>
        <img src={oneIcon} className={styles.mobileTimelineIcon} />
        <img src={oneIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h3>Application</h3>
          <p>{firstStep}</p>
        </div>
      </div>
      <div className={styles.timelineStep}>
        <img src={twoIcon} className={styles.mobileTimelineIcon} />
        <img src={twoIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h3>Interview</h3>
          <p>{secondStep}</p>
        </div>
      </div>
      <div className={styles.timelineStep}>
        <img src={threeIcon} className={styles.mobileTimelineIcon} />
        <img src={threeIconDesktop} className={styles.desktopTimelineIcon} />
        <div className={styles.timelineStepText}>
          <h3>Notification of Decision</h3>
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
        question={<h3>How much of a time commitment is Hack4Impact-UMD?</h3>}
        answer={
          <p>
            Most students spend about 3 to 5 hours per week on Hack4Impact-UMD project work. Each project team
            determines their own schedule, but most meet for about 1 hour per week to plan and delegate tasks. The other
            time is spent working on the project individually. <br /> <br />
            We also hold mandatory general body meetings every month, which are about 1 hour long. Hack4Impact-UMD holds
            many other events during the year, such as volunteer events, tech talks, and social events. These events are
            not required, but we highly encourage our members to attend. <br /> <br />
            Leadership roles, such as executive directors, project managers, and tech leads will spend more time, up to
            10 hours a week.{' '}
          </p>
        }
      />
      <FaqRow
        question={<h3>Do I need any prior technical experience before applying?</h3>}
        answer={
          <p>
            It is not required to know any specific languages, but we do require students who are applying to become
            developers or tech leads to have taken CMSC 131 or have basic programming skills (classes, arrays, maps,
            etc.) already. <br /> <br />
            General web development skills like HTML, CSS, and JavaScript are also good to know. <br /> <br />
            People with less programming and web development experience will be placed in the bootcamp group, which will
            allow you to get to know other people in Hack4Impact-UMD, improve your web development skills, and
            understand the team dynamics in developer team. <br /> <br />
            Roles like the Sourcing Commitee Member do not require any technical background.
          </p>
        }
      />
      <FaqRow
        question={<h3>What tech stack is used in your projects?</h3>}
        answer={
          <p>
            We mainly develop new projects on the MERN (MongoDB, Express.js, React, and Node.js) stack. However, we will
            also help out nonprofit organizations that have existing websites on other stacks, such as Django, Flask, or
            Ruby on Rails.
          </p>
        }
      />
      <br />
      <br />
      <br />
    </Faq>
  );
}

export default StudentApply;

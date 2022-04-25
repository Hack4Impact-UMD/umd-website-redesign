import React from 'react';
import styles from './AboutUs.module.css';
import Person from '../components/Person';
import Navbar from '../imported/Navbar/Navbar/Navbar';
import Footer from '../components/Footer';
import ValueCard from '../components/ValueCard';

import headerDesktop from './assets/aboutus_header.png';
import headerMobile from './assets/aboutus_header_mobile.png';
import placeholder from './assets/placeholder.png';

function AboutUs() {
  return (
    <div className={styles.aboutUs}>
      <div className={styles.navBarDiv}>
        <Navbar />
      </div>
      <AboutUsHeader />
      <OurMission />
      <ValueCardRow />
      <ExecBoard />
      <TeamMembers />
      <div className={styles.footerDiv}>
        <Footer />
      </div>
    </div>
  );
}

function AboutUsHeader() {
  return (
    <div className={styles.headerDiv}>
      <picture>
        {/* background image should change when navbar changes */}
        <source srcSet={headerDesktop} media={'(min-width: 700px)'} />
        <img src={headerMobile} className={styles.headerImg}></img>
      </picture>
      <div className={styles.headerText}>About Us</div>
    </div>
  );
}

function OurMission() {
  return (
    <div className={styles.ourMission}>
      <h1>Our Mission</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris
      </p>
    </div>
  );
}

function ValueCardRow() {
  const summary =
    'Short summary about the value. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.';

  return (
    <div className={styles.valuesCardsDiv}>
      <h1>Our Values</h1>
      <div className={styles.valuesCards}>
        <ValueCard mainText={'Go Beyond Technology'} hoverText={summary} />
        <ValueCard mainText={'Develop with Care'} hoverText={summary} revBackground={true} />
        <ValueCard mainText={'Be Open Minded'} hoverText={summary} />
      </div>
    </div>
  );
}

function ExecBoard() {
  return (
    <div className={styles.execBoardDiv}>
      <h1>Executive Board</h1>
      <div className={styles.execBoardPhotos}>
        <Person src={placeholder} memberName={'Surabi Ramamurthy'} role={'Executive Director'} pronouns={'she/her'} />
        <Person src={placeholder} memberName={'Daneil Nguyen'} role={'Director of Product'} pronouns={'he/him'} />
        <Person src={placeholder} memberName={'Vrundal Shah'} role={'Director of Engineering'} pronouns={'he/him'} />
        <Person src={placeholder} memberName={'Katherine Wang'} role={'Director of Design'} pronouns={'she/her'} />
        <Person src={placeholder} memberName={'Stevin Berit'} role={'Director of Sourcing'} pronouns={'he/him'} />
        <Person
          src={placeholder}
          memberName={'Sadena Rishindran'}
          role={'Co-Director of Education'}
          pronouns={'she/her'}
        />
        <Person src={placeholder} memberName={'Miranda Song'} role={'Co-Director of Education'} pronouns={'she/her'} />
        <Person src={placeholder} memberName={'Anaya Nadig'} role={'Director of Events'} pronouns={'she/her'} />
        <Person src={placeholder} memberName={'Ben Lin'} role={'Director of Recruitment'} pronouns={'he/him'} />
      </div>
    </div>
  );
}

function TeamMembers() {
  return (
    <div className={styles.teamMembersDiv}>
      <h1>Team Members</h1>
      <div className={styles.teamMembersPhotos}>
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
        <Person memberName={'Katherine Wang'} team={'Website Redesign Team'} role={'Designer'} pronouns={'she/her'} />
      </div>
    </div>
  );
}

export default AboutUs;

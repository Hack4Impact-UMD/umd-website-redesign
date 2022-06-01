import React from 'react';
import styles from '../styles/about_us/AboutUs.module.css';
import Person from '../components/Person';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import ValueCard from '../components/about_us/ValueCard';

import headerDesktop from '../components/assets/aboutus_header.png';
import headerMobile from '../components/assets/aboutus_header_mobile.png';
import placeholder from '../components/assets/placeholder.png';
import axios from 'axios';

axios.get('http://localhost:1337/api/members').then(response => {
  console.log(response);
});


function AboutUs() {
  return (
    <div className={styles.aboutUs}>
      <AboutUsHeader />
      <OurMission />
      <ValueCardRow />
      <ExecBoard />
      <TeamMembers />
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
      Hack4Impact-UMD is a student organization at the University of Maryland, College Park. Founded in Fall 2020 by Lydia Hu, Simin Li, and Abbie Tran, the club focuses on using tech skills for helping the community while introducing students to a professional working environment and other post-graduation options compared to industry and academia.
      </p>
    </div>
  );
}

function ValueCardRow() {
  const summary =
    'Short summary about the value. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.';

  const goBeyondTechnology = "Technology is only one tool we use in our greater mission for social impact. Technology alone is not enough. We learn from, work with, and are inspired by others who are tackling social problems using a multitude of tools."

  const developWithCare = "We build with others in mind. Empathy and compassion are crucial to serving our partner organizations and members. When we embark on projects, we work to deeply understand the people who we are helping."

  return (
    <div className={styles.valuesCardsDiv}>
      <h1>Our Values</h1>
      <div className={styles.valuesCards}>
        <ValueCard mainText={'Go Beyond Technology'} hoverText={goBeyondTechnology} />
        <ValueCard mainText={'Develop with Care'} hoverText={developWithCare} revBackground={true} />
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

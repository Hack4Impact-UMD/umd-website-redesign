import React from 'react';
import styles from './AboutUs.module.css';
import Person from '../components/Person';
import Navbar from '../imported/Navbar/Navbar/Navbar';
import Footer from '../components/Footer';

import header from './assets/aboutus_header.png';
import placeholder from './assets/placeholder.png';
import footerBackground from './assets/footer_background.jpg';

function AboutUs(props: any) {
  return (
    <div className={styles.aboutUs}>
      <div className={styles.navBarDiv}>
        <Navbar />
      </div>
      <AboutUsHeader />
      <OurMission />
      <ValuesCardRow />
      <ExecBoard />
      <TeamMembers />
      <Footer />
    </div>
  );
}

function AboutUsHeader() {
  return (
    <div>
      <img src={header} className={styles.headerImg}></img>
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

function ValuesCard(props: any) {
  return (
    <div className={styles.valuesCard}>
      <span className={styles.valuesCardTextMain}>{props.mainText}</span>
      <span className={styles.valuesCardTextHover}>{props.hoverText}</span>
    </div>
  );
}

function ValuesCardRow() {
  const summary =
    'Short summary about the value. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.';

  return (
    <div className={styles.valuesCardsDiv}>
        <h1>Our Values</h1>
      <div className={styles.valuesCards}>
        <ValuesCard mainText={'Go Beyond Technology'} hoverText={summary} />
        <ValuesCard mainText={'Develop with Care'} hoverText={summary} />
        <ValuesCard mainText={'Be Open Minded'} hoverText={summary} />
      </div>
    </div>
  );
}

function ExecBoard() {
    return (
     <div className={styles.execBoardDiv}>
     <h1>Executive Board</h1>
     <div className={styles.execBoardPhotos}>
     <Person src={placeholder} memberName={"Surabi Ramamurthy"} role={"Executive Director"} pronouns={"she/her"}/>
     <Person src={placeholder} memberName={"Daneil Nguyen"} role={"Director of Product"} pronouns={"he/him"}/>
     <Person src={placeholder} memberName={"Vrundal Shah"} role={"Director of Engineering"} pronouns={"he/him"}/>
     <Person src={placeholder} memberName={"Katherine Wang"} role={"Director of Design"} pronouns={"she/her"}/>
     <Person src={placeholder} memberName={"Stevin Berit"} role={"Director of Sourcing"} pronouns={"he/him"}/>
     <Person src={placeholder} memberName={"Sadena Rishindran"} role={"Co-Director of Education"} pronouns={"she/her"}/>
     <Person src={placeholder} memberName={"Miranda Song"} role={"Co-Director of Education"} pronouns={"she/her"}/>
     <Person src={placeholder} memberName={"Anaya Nadig"} role={"Director of Events"} pronouns={"she/her"}/>
     <Person src={placeholder} memberName={"Ben Lin"} role={"Director of Recruitment"} pronouns={"he/him"}/>
     </div>
     </div>
    );
}

function TeamMembers() {
    return (
    <div className={styles.teamMembersDiv}>
     <h1>Team Members</h1>
     <div className={styles.teamMembersPhotos}>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     <Person memberName={"Katherine Wang"} team={"Website Redesign Team"} role={"Designer"} pronouns={"she/her"}/>
     </div>
    </div>
    );
}


export default AboutUs;

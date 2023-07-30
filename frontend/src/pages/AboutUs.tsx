import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/about_us/AboutUs.module.css';
import Person from '../components/Person';
import ValueCard from '../components/about_us/ValueCard';

import headerDesktop from '../components/assets/backgrounds/about_us/aboutus_header.png';
import headerMobile from '../components/assets/backgrounds/about_us/aboutus_header_mobile.png';
import placeholder from '../components/assets/placeholder.png';
import { useAxios } from '../components/HelperFunctions';
import globe from '../components/assets/globe.svg';

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
      <div className={styles.headerText}>
        <h1>About Us</h1>
      </div>
    </div>
  );
}

function OurMission() {
  return (
    <div className={styles.ourMission}>
      <h2>Our Mission</h2>
      <p>
        Hack4Impact-UMD is a student organization at the University of Maryland, College Park. Founded in Fall 2020 by{' '}
        <a href="https://www.linkedin.com/in/lydia-hu/">Lydia Hu</a>,{' '}
        <a href="https://www.linkedin.com/in/simin-li-88088b/">Simin Li</a>, and{' '}
        <a href="https://www.linkedin.com/in/abbie-tran-a47893153/">Abbie Tran</a>, the club focuses on using tech
        skills for helping the community while introducing students to a professional working environment and other
        post-graduation options compared to industry and academia.
      </p>
    </div>
  );
}

function ValueCardRow() {
  const beOpenMinded =
    'Our process depends on openness to different people, topics, and perspectives. We embrace difference and work against intolerance to foster an inclusive environment. Our goal is to expose our members to the vast opportunities and daunting challenges in our work.';

  const goBeyondTechnology =
    'Technology is only one tool we use in our greater mission for social impact. Technology alone is not enough. We learn from, work with, and are inspired by others who are tackling social problems using a multitude of tools.';

  const developWithCare =
    'We build with others in mind. Empathy and compassion are crucial to serving our partner organizations and members. When we embark on projects, we work to deeply understand the people who we are helping.';

  return (
    <div className={styles.valuesCardsDiv}>
      <h2>Our Values</h2>
      <div className={styles.valuesCards}>
        <ValueCard mainText={'Go Beyond Technology'} hoverText={goBeyondTechnology} />
        <ValueCard mainText={'Develop with Care'} hoverText={developWithCare} revBackground={true} />
        <ValueCard mainText={'Be Open Minded'} hoverText={beOpenMinded} />
      </div>
    </div>
  );
}

function ExecBoard() {
  const res = useAxios(
    process.env.REACT_APP_ROOT_URL +
      '/api/members?populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Board Member',
    'GET',
    {},
  );
  const boardMembers = res.data ? res.data['data'] : [];

  return (
    <div className={styles.execBoardDiv}>
      <h2>Executive Board</h2>
      <div className={styles.execBoardPhotos}>
        {!boardMembers
          ? boardMembers
          : boardMembers.map((item, index) => (
              <Person
                key={index}
                memberName={item['attributes']['firstName'] + ' ' + item['attributes']['lastName']}
                role={
                  (item['attributes']['componentRolesArr'] as Array<any>).find((e) => e['isDisplayRole'] == true)[
                    'title'
                  ]
                }
                pronouns={item['attributes']['pronouns']}
                src={
                  item['attributes']['avatar']['data']
                    ? item['attributes']['avatar']['data']['attributes']['url']
                    : null
                }
              />
            ))}
      </div>
    </div>
  );
}

function TeamMembers() {
  // fetch data with axios, assign the array of members to members var
  // const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/members?populate=*", "GET", {});
  const res = useAxios(
    process.env.REACT_APP_ROOT_URL +
      '/api/members?pagination[page]=1&pagination[pageSize]=100&populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Member',
    'GET',
    {},
  );
  const members = res.data ? res.data['data'] : [];

  // members.map(item => console.log(item["attributes"]["firstName"]));

  return (
    <div className={styles.teamMembersDiv}>
      <h2>Team Members</h2>
      <div className={styles.teamMembersPhotos}>
        {!members
          ? members
          : // render team members
            members.map((item, index) => (
              <Person
                key={index}
                memberName={item['attributes']['firstName'] + ' ' + item['attributes']['lastName']}
                team={
                  (item['attributes']['componentRolesArr'] as Array<any>).find((e) => e['isDisplayRole'] == true)[
                    'team'
                  ]
                }
                role={
                  (item['attributes']['componentRolesArr'] as Array<any>).find((e) => e['isDisplayRole'] == true)[
                    'title'
                  ]
                }
                pronouns={item['attributes']['pronouns']}
                src={
                  item['attributes']['avatar']['data']
                    ? item['attributes']['avatar']['data']['attributes']['url']
                    : null
                }
              />
            ))}
      </div>
    </div>
  );
}

export default AboutUs;

import React, { useState } from 'react';
import styles from '../styles/about_us/AboutUs.module.css';
import Person from '../components/Person';
import ValueCard from '../components/about_us/ValueCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FADE_IN_TRANSITION } from '../constants/animations';

import headerDesktop from '../components/assets/backgrounds/about_us/aboutus_header2023.png';
import headerMobile from '../components/assets/backgrounds/about_us/aboutus_header_mobile2023.png';
import { useAxios } from '../components/HelperFunctions';

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
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={styles.headerDiv}
      style={{ opacity: imageLoaded ? 1 : 0, transition: FADE_IN_TRANSITION }}
    >
      <picture>
        <source srcSet={headerDesktop} media={'(min-width: 700px)'} />
        <img
          src={headerMobile}
          className={styles.headerImg}
          onLoad={() => setImageLoaded(true)}
        ></img>
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

const EXEC_ORDER = [
  'Executive Director',
  'Director of Product',
  'Director of Engineering',
  'Director of Design',
  'Director of Education',
  'Director of Finance and Sponsorship',
  'Director of Events',
  'Director of Recruitment',
  'Director of Public Relations and Outreach',
  'Senior Advisor',
];

function ExecBoard() {
  const res = useAxios(
    process.env.REACT_APP_ROOT_URL +
      '/api/members?populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Board Member',
    'GET',
    {},
  );
  const boardMembers = res.data?.data ?? [];

  const sortedMembers = boardMembers
    .map((item) => {
      const displayRole = item?.attributes?.componentRolesArr?.find((e) => e?.isDisplayRole === true);
      return { ...item, displayRole };
    })
    .sort((a, b) => EXEC_ORDER.indexOf(a.displayRole?.title ?? '') - EXEC_ORDER.indexOf(b.displayRole?.title ?? ''));

  return (
    <div className={styles.execBoardDiv}>
      <h2>Executive Board</h2>
      {!res.loaded ? (
        <LoadingSpinner text="Loading executive board..." />
      ) : (
        <div className={styles.execBoardPhotos}>
          {sortedMembers.map((item) => (
            <Person
              key={item.id}
              memberName={`${item?.attributes?.firstName ?? ''} ${item?.attributes?.lastName ?? ''}`.trim()}
              role={item.displayRole?.title ?? ''}
              pronouns={item?.attributes?.pronouns ?? ''}
              src={item?.attributes?.avatar?.data?.attributes?.url ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const MEMBERS_PAGE_SIZE = 100;

function TeamMembers() {
  const res = useAxios(
    `${process.env.REACT_APP_ROOT_URL}/api/members?pagination[page]=1&pagination[pageSize]=${MEMBERS_PAGE_SIZE}&populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Member`,
    'GET',
    {},
  );
  const members = res.data?.data ?? [];

  return (
    <div className={styles.teamMembersDiv}>
      <h2>Team Members</h2>
      {!res.loaded ? (
        <LoadingSpinner text="Loading team members..." />
      ) : (
        <div className={styles.teamMembersPhotos}>
          {members.map((item) => {
            const displayRole = item?.attributes?.componentRolesArr?.find((e) => e?.isDisplayRole === true);
            return (
              <Person
                key={item.id}
                memberName={`${item?.attributes?.firstName ?? ''} ${item?.attributes?.lastName ?? ''}`.trim()}
                team={displayRole?.team ?? ''}
                role={displayRole?.title ?? ''}
                pronouns={item?.attributes?.pronouns ?? ''}
                src={item?.attributes?.avatar?.data?.attributes?.url ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AboutUs;

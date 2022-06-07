import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/about_us/AboutUs.module.css';
import Person from '../components/Person';
import ValueCard from '../components/about_us/ValueCard';

import headerDesktop from '../components/assets/aboutus_header.png';
import headerMobile from '../components/assets/aboutus_header_mobile.png';
import placeholder from '../components/assets/placeholder.png';
import axios from 'axios';

// function used to use axios, which will query data from the backend
const useAxios = (url: any, method: any, payload: any) => {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());

  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.request({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url,
        });
        setData(response.data);
      } catch (error) {
        // setError(error.message);
      } finally {
        setLoaded(true);
      }

    })();
  }, []);
  return { cancel, data, error, loaded };
};


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
  const res = useAxios("http://localhost:1337/api/members?populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Board Member", "GET", {});
  const boardMembers = res.data ? res.data["data"] : [];

  return (
    <div className={styles.execBoardDiv}>
      <h1>Executive Board</h1>
      <div className={styles.execBoardPhotos}>
        {!boardMembers ? boardMembers :
          boardMembers.map((item, index) => (
            <Person key={index}
              memberName={item["attributes"]["firstName"] + ' ' + item["attributes"]["lastName"]}
              role={(item['attributes']['componentRolesArr'] as Array<any>).find(e => e['isDisplayRole'] == true)['title']}
              pronouns={item["attributes"]["pronouns"]}
              // src={process.env.REACT_APP_ROOT_URL + item["attributes"]["avatar"]["data"]["attributes"]["url"]}
            />
          ))}
        <Person src={placeholder} memberName={'Surabi Ramamurthy'} role={'Executive Director'} pronouns={'she/her'} />
      </div>
    </div>
  );
}

function TeamMembers() {

  // fetch data with axios, assign the array of members to members var 
  // const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/members?populate=*", "GET", {});
  const res = useAxios("http://localhost:1337/api/members?populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Member", "GET", {});
  const members = res.data ? res.data["data"] : [];

  // members.map(item => console.log(item["attributes"]["firstName"]));

  return (
    <div className={styles.teamMembersDiv}>
      <h1>Team Members</h1>
      <div className={styles.teamMembersPhotos}>
        {!members ? members :
        // render team members
          members.map((item, index) => (
            <Person key={index}
              memberName={item["attributes"]["firstName"] + ' ' + item["attributes"]["lastName"]}
              team={(item['attributes']['componentRolesArr'] as Array<any>).find(e => e['isDisplayRole'] == true)['team']}
              role={(item['attributes']['componentRolesArr'] as Array<any>).find(e => e['isDisplayRole'] == true)['title']}
              pronouns={item["attributes"]["pronouns"]}
              // src={process.env.REACT_APP_ROOT_URL + item["attributes"]["avatar"]["data"]["attributes"]["url"]}
            />
          ))}
        <Person
          memberName={'Katherine Wang'}
          team={'Website Redesign Team'}
          role={'Designer'}
          pronouns={'she/her'}
        />
      </div>
    </div>
  );
}

export default AboutUs;

import React, { useEffect, useRef, useState } from 'react';
// import styles from '../styles/about_us/AboutUs.module.css';
import styles from '../styles/apply/StudentApply.module.css';

import Person from '../components/Person';
import ValueCard from '../components/about_us/ValueCard';
import { Params, useParams } from 'react-router-dom';
import { useAxios } from '../components/HelperFunctions'

let params: Readonly<Params<string>>;
let proj: null;

function ProjectPage() {
    params = useParams();

    const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/projects?populate=*/api/members?&filters[projectName][$eq]=" + params.projectname, "GET", {});
    const project = res.data ? res.data["data"][0] : null;
    proj = project;

    // console.log(proj);

    if (proj){
    return (
        <div>
            <Header/><TeamMembers/>
        </div>
    );
    } else 
    return (
        <div className={styles.studentApplyHeader}>
            <div className={styles.studentApplyHeaderContent}>
                <h1>{params ? params.projectname + "? Hmm... That doesn't sound like a project." : "Hmm."}</h1>
            </div>
        </div>
    );
}

function Header() {
    return (
        <div className={styles.studentApplyHeader}>
        <div className={styles.studentApplyHeaderContent}>
            <h1>{params ? params.projectname : "Project Name"}</h1>
            {/* <StudentNonprofitSelector curr={'student'} /> */}
            <h2>
            project id: { proj ? proj['id'] : ""} <br></br>
            project name: { proj ? proj['attributes']['projectName'] : ""} <br></br>
            project startDate: { proj ? proj['attributes']['projectStartDate'] : ""} <br/>
            project summary: { proj ? proj['attributes']['projectSummary'] : ""} <br/>
            project blurb: { proj ? proj['attributes']['projectBlurb'] : ""} &nbsp;
            </h2>
        </div>
        </div>
    );
}
  
function TeamMembers() {

// fetch data with axios, assign the array of members to members var 
// const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/members?populate=*", "GET", {});
// const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/members?populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Member", "GET", {});
// const members = res.data ? res.data["data"] : [];

// members.map(item => console.log(item["attributes"]["firstName"]));

return (
    <div className={styles.teamMembersDiv}>
    <h1>Team Members</h1>
    <div className={styles.teamMembersPhotos}>
        {/* {!members ? members :
        // render team members
        members.map((item, index) => (
            <Person key={index}
            memberName={item["attributes"]["firstName"] + ' ' + item["attributes"]["lastName"]}
            team={(item['attributes']['componentRolesArr'] as Array<any>).find(e => e['isDisplayRole'] == true)['team']}
            role={(item['attributes']['componentRolesArr'] as Array<any>).find(e => e['isDisplayRole'] == true)['title']}
            pronouns={item["attributes"]["pronouns"]}
            src={process.env.REACT_APP_ROOT_URL + item["attributes"]["avatar"]["data"]["attributes"]["url"] ? process.env.REACT_APP_ROOT_URL + item["attributes"]["avatar"]["data"]["attributes"]["url"] : null}
            />
        ))} */}
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

export default ProjectPage;

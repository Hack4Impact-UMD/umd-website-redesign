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

    const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/projects?populate=*&filters[path][$eq]=" + params.projectpath, "GET", {});
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
                <h1>{params ? params.projectpath + "? Hmm... That doesn't sound like a project." : "Hmm."}</h1>
            </div>
        </div>
    );
}

function Header() {
    return (
        <div className={styles.studentApplyHeader}>
        <div className={styles.studentApplyHeaderContent}>
            <h1>{ proj ? proj['attributes']['title'] : ""}</h1>
            
            <h2>
            project title: { proj ? proj['attributes']['title'] : ""} <br></br>
            project startDate: { proj ? proj['attributes']['startDate'] : ""} <br/>
            project summary: { proj ? proj['attributes']['summary'] : ""} <br/>
            project blurb: { proj ? proj['attributes']['blurb'] : ""} &nbsp;
            project image: <img src={ proj && proj['attributes']["image"]['data'] ? process.env.REACT_APP_ROOT_URL + proj['attributes']["image"]["data"][0]["attributes"]["url"] : "https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png"}/>
            </h2>
        </div>
        </div>
    );
}
  
function TeamMembers() {
    const members = proj ? proj["attributes"]["members"]["data"]: [];
    return (
        <div className={styles.teamMembersDiv}>
        <h1>Team Members</h1>
        <div className={styles.teamMembersPhotos}>
            {!members ? members :
            // render team members
            members.map((item, index) => (
                <Person key={index}
                memberName={item["attributes"]["firstName"] + ' ' + item["attributes"]["lastName"]}
                // role={(item['attributes']['componentRolesArr'] as Array<any>).find(e => e['isDisplayRole'] == true)['title']}
                pronouns={item["attributes"]["pronouns"]}
                // src={item["attributes"]["avatar"]["data"] ? process.env.REACT_APP_ROOT_URL + item["attributes"]["avatar"]["data"]["attributes"]["url"] : null}
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

export default ProjectPage;

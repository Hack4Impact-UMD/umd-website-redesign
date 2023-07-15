import React, { useEffect, useRef, useState } from 'react';
import stylestwo from '../styles/projects/ProjectsTop.module.css';
import styles from '../styles/projects/ProjectsPage.module.css';
import githubIcon from '../components/assets/icons/github_icon.png';
import internetIcon from '../components/assets/icons/internet_icon.png';
import Person from '../components/Person';
import { Params, useParams } from 'react-router-dom';
import { useAxios, getSeason } from '../components/HelperFunctions';

let params: Readonly<Params<string>>;
let proj: null;

function ProjectPage() {
  params = useParams();

  //query to get project info
  const res = useAxios(
    process.env.REACT_APP_ROOT_URL +
      '/api/projects?fields[0]=title&fields[1]=startDate&fields[2]=blurb&fields[3]=repoURL&fields[4]=hostedProjectURL&fields[5]=Season&fields[6]=Year&populate[image][fields][0]=url&populate[members][fields][0]=firstName&populate[members][fields][0]=lastName&populate[members][fields][0]=pronouns&populate[members][populate][componentRolesArr][fields][0]=title&populate[members][populate][componentRolesArr][fields][1]=isDisplayRole&populate[members][populate][componentRolesArr][fields][2]=team&populate[members][populate][avatar][fields][0]=url&filters[path][$eq]=' +
      params.projectpath,
    'GET',
    {},
  );

  const project = res.data ? res.data['data'][0] : null;
  //console.log(project);
  proj = project;

  if (proj) {
    return (
      <div className={styles.content}>
        <Header />
        <TeamMembers />
      </div>
    );
  } else
    return (
      <div className={styles.studentApplyHeader}>
        <div className={styles.studentApplyHeaderContent}>
          <h1>{params ? params.projectpath + '' : ''}</h1>
        </div>
      </div>
    );
}
function Header() {
  const startDate =
    proj && proj['attributes']['startDate']
      ? getSeason((proj['attributes']['startDate'] as string).substring(5, 7) as unknown as number) +
        ' ' +
        (proj['attributes']['startDate'] as string).substring(0, 4)
      : '';
  const endDate =
    proj && proj['attributes']['Season'] && proj['attributes']['Year']
      ? ' - ' + proj['attributes']['Season'] + ' ' + proj['attributes']['Year']
      : '';
  const date = startDate + endDate;
  return (
    <div className={styles.studentApplyHeader}>
      <div className={styles.studentApplyHeaderContent}>
        <header className={stylestwo.title}>{proj ? proj['attributes']['title'] : ''}</header>
        <div className={stylestwo.projectInfoContainer}>
          <div className={stylestwo.flexChild}>
            <div className={stylestwo.projectPicture}>
              <img
                src={
                  proj && proj['attributes']['image']['data']
                    ? proj['attributes']['image']['data'][0]['attributes']['url']
                    : 'https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png'
                }
              />
            </div>
          </div>
          <div className={stylestwo.flexChild}>
            <div className={stylestwo.date}> {date}</div>
            <p className={stylestwo.projectDescription}>
              {proj ? proj['attributes']['blurb'] : 'More information about this project is pending.'} <br />
              <br />
              {proj && proj['attributes']['repoURL'] ? (
                <a href={proj['attributes']['repoURL']}>
                  <img src={githubIcon} />
                </a>
              ) : (
                ''
              )}{' '}
              &nbsp;
              {proj && proj['attributes']['hostedProjectURL'] ? (
                <a href={proj['attributes']['hostedProjectURL']}>
                  <img src={internetIcon} />
                </a>
              ) : (
                ''
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMembers() {
  const members = proj ? proj['attributes']['members']['data'] : [];
  return (
    <div className={styles.teamMembersDiv}>
      <h2>Team Members</h2>
      <div className={styles.teamMembersPhotos}>
        {!members
          ? 'Looks like there are no team members here. Check again later?'
          : // render team members
            members.map((item, index) => {
              console.log(item['attributes']['componentRolesArr']);
              //if this user had no role in the project dont render them
              if (Array.from(item['attributes']['componentRolesArr']).length == 0) {
                return null;
              } else {
                return (
                  <Person
                    key={index}
                    memberName={item['attributes']['firstName'] + ' ' + item['attributes']['lastName'] || 'Member'}
                    //if no title exists for the user use "Member"
                    role={
                      (item['attributes']['componentRolesArr'] as Array<any>).find(
                        (e) => e['team'] && e['team'].trim() == proj!['attributes']['title'],
                      )['title'] || 'Member'
                    }
                    //if no pronouns are provided, show nothing for that
                    pronouns={item['attributes']['pronouns'] || null}
                    //if no user image exists, return null, a template will be used
                    src={
                      item['attributes']['avatar']['data'] != null
                        ? item['attributes']['avatar']['data']['attributes']['url']
                        : null
                    }
                  />
                );
              }
            })}
      </div>
    </div>
  );
}

export default ProjectPage;

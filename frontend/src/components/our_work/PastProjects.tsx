import React, { useState } from 'react';
import { PastProjectCard } from './PastProjectCard';
import { past_projects } from './past_projects';
import styles from '../../styles/our_work/PastProjects.module.css';
import { useAxios } from '../HelperFunctions';
import { getSeason } from '../HelperFunctions';

const PastProjects: React.FC = () => {
  // query for all projects 
  const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/projects?populate=*", "GET", {});
  const allProjects = res.data ? res.data["data"] : [];
  const cleanedProjects = allProjects.map(x => x["attributes"]);
  // TODO: REMOVE, DEBUG STATEMENT
  // console.log("cleaned projects: ", cleanedProjects); 
  const past_projects = cleanedProjects;

  // Set up state for search bar functionality
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  // //Loads more projects
  // const loadMoreProjects = () => {
  //   //get access to the div that shows the projects
  //   const projectsDisplay: Element | null = document.querySelector(`${styles.projectsDisplay}`)
  //   //show each project
  //   for (let i = projectsToLoad; i < projectsToLoad + 3 && i < filteredData.length; i++) {
  //     if (projectsDisplay != null) {
  //       projectsDisplay.innerHTML += filteredData[i]
  //     }
  //   }
  //   setProjectsToLoad(projectsToLoad + 3)
  // }


  const modifiedInput = searchInput.trim().toLowerCase()

  // filters projects based on project title, project data, nonprofit name, project team, season and year.

  const filteredData = past_projects.filter((project) => {
    // check if query is similar to a team member's name
    const team_lowercase: string[] = [];
    (project['members']['data'] as Array<any>).forEach((member) => {
      team_lowercase.push(((member['attributes']['firstName'] + " " + member['attributes']['lastName']) as string).toLowerCase());
    });
    const member_match: string[] = team_lowercase.filter((elem) => {
      if (elem.includes(modifiedInput)) {
        return true;
      }
    });


    // used to check if the input contains the season and/or year
    const season_and_year: string = ((project['Season'] + " " + project['Year']) as string).toLowerCase();

    //if query is empty, return all projects
    if (modifiedInput === '') {
      return project;
    } else if (project['title'] && (project['title'] as string).toLowerCase().includes(modifiedInput)) {
      return project;
    } else if (project['startDate'] && (project['startDate'] as string).toLowerCase().includes(modifiedInput)) {
      return project;
    } else if (project['link'] && (project['link'] as string).toLowerCase().includes(modifiedInput)) {
      return project;
    } else if ((project['Season'] || project['Year']) && season_and_year.includes(modifiedInput)) {
      return project;
    } else if (member_match.length > 0) {
      return project;
    } else if (member_match.length == 0) {
      return null;
    }


  });

  return (
    <div className={styles.pastProjectsContainer}>
      <h2 id={styles.sectionTitle}>Past Projects</h2>
      <div id={styles.searchbarWrapper}>
        <img
          id={styles.clearIcon}
          src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxLjk3NiA1MS45NzYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxLjk3NiA1MS45NzY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPGc+Cgk8cGF0aCBkPSJNNDQuMzczLDcuNjAzYy0xMC4xMzctMTAuMTM3LTI2LjYzMi0xMC4xMzgtMzYuNzcsMGMtMTAuMTM4LDEwLjEzOC0xMC4xMzcsMjYuNjMyLDAsMzYuNzdzMjYuNjMyLDEwLjEzOCwzNi43NywwICAgQzU0LjUxLDM0LjIzNSw1NC41MSwxNy43NCw0NC4zNzMsNy42MDN6IE0zNi4yNDEsMzYuMjQxYy0wLjc4MSwwLjc4MS0yLjA0NywwLjc4MS0yLjgyOCwwbC03LjQyNS03LjQyNWwtNy43NzgsNy43NzggICBjLTAuNzgxLDAuNzgxLTIuMDQ3LDAuNzgxLTIuODI4LDBjLTAuNzgxLTAuNzgxLTAuNzgxLTIuMDQ3LDAtMi44MjhsNy43NzgtNy43NzhsLTcuNDI1LTcuNDI1Yy0wLjc4MS0wLjc4MS0wLjc4MS0yLjA0OCwwLTIuODI4ICAgYzAuNzgxLTAuNzgxLDIuMDQ3LTAuNzgxLDIuODI4LDBsNy40MjUsNy40MjVsNy4wNzEtNy4wNzFjMC43ODEtMC43ODEsMi4wNDctMC43ODEsMi44MjgsMGMwLjc4MSwwLjc4MSwwLjc4MSwyLjA0NywwLDIuODI4ICAgbC03LjA3MSw3LjA3MWw3LjQyNSw3LjQyNUMzNy4wMjIsMzQuMTk0LDM3LjAyMiwzNS40NiwzNi4yNDEsMzYuMjQxeiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="
        />
        <input
          id={styles.searchbar}
          placeholder="search by project, nonprofit, team member, season, or year"
          onChange={handleChange}
          value={searchInput}
          type="text"
        />
        <img
          id={styles.searchIcon}
          src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2Ljk2NiA1Ni45NjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2Ljk2NiA1Ni45NjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTU1LjE0Niw1MS44ODdMNDEuNTg4LDM3Ljc4NmMzLjQ4Ni00LjE0NCw1LjM5Ni05LjM1OCw1LjM5Ni0xNC43ODZjMC0xMi42ODItMTAuMzE4LTIzLTIzLTIzcy0yMywxMC4zMTgtMjMsMjMgIHMxMC4zMTgsMjMsMjMsMjNjNC43NjEsMCw5LjI5OC0xLjQzNiwxMy4xNzctNC4xNjJsMTMuNjYxLDE0LjIwOGMwLjU3MSwwLjU5MywxLjMzOSwwLjkyLDIuMTYyLDAuOTIgIGMwLjc3OSwwLDEuNTE4LTAuMjk3LDIuMDc5LTAuODM3QzU2LjI1NSw1NC45ODIsNTYuMjkzLDUzLjA4LDU1LjE0Niw1MS44ODd6IE0yMy45ODQsNmM5LjM3NCwwLDE3LDcuNjI2LDE3LDE3cy03LjYyNiwxNy0xNywxNyAgcy0xNy03LjYyNi0xNy0xN1MxNC42MSw2LDIzLjk4NCw2eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
        />
      </div>
      {filteredData.length != 0 ?
        <div id={styles.projectsDisplay}>
          {filteredData.map((item, index) => {

            return (<PastProjectCard
              key={index}
              link={"ourwork/" + item['path']}
              title={item['title']}
              date={item['startDate'] ? getSeason((item["startDate"] as string).substring(5, 7) as unknown as number) + " " + (item["startDate"] as string).substring(0, 4) : ""}
              image={item["image"]['data'] ? item["image"]["data"][0]["attributes"]["url"] : "https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png"}
              altText={item['title']}
            />)
          })}
        </div> :
        <div id={styles.notFound}>No results for &quot;{searchInput}&quot;</div>
      }
      {/* <button id={styles.showMore} onClick={loadMoreProjects}>Show more</button> */}

    </div>
  );
};

export default PastProjects;

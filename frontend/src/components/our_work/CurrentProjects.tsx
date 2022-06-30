import React from 'react';
import FeaturedProjectCard from '../home_page/FeaturedProjectCard';
import styles from '../../styles/our_work/CurrentProjects.module.css';
import { getSeason, useAxios } from '../HelperFunctions';

const CurrentProjects = () => {
  // fetch currentProjects from backend
  
  const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/projects?populate=*&filters[isCurrentProject][$eq]=true", "GET", {});
  const currentProjects = res.data ? res.data["data"] : [];

  return (
    <div>
      <h1 id={styles.sectionTitle}>Current Projects</h1>
      {currentProjects.map((item, index) => (
        <FeaturedProjectCard
          key={index}
          link={"ourwork/" + item["attributes"]["path"]}
          title={item["attributes"]["title"]}
          date={item["attributes"]["startDate"] ? getSeason((item["attributes"]["startDate"] as string).substring(5,7) as unknown as number) +  " " + (item["attributes"]["startDate"] as string).substring(0,4) : ""}
          summary={item["attributes"]["summary"]}
          image={item['attributes']["image"]['data'] ? process.env.REACT_APP_ROOT_URL + item['attributes']["image"]["data"][0]["attributes"]["url"] : "https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png"}
          altText={item["attributes"]["imageAltText"]}
        />
      ))}
    </div>
  );
};

export default CurrentProjects;

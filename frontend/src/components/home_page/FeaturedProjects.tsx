import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import styles from '../../styles/home/FeaturedProjects.module.css';
import { useAxios , getSeason } from '../HelperFunctions';
import StandardButton from '../buttons/StandardButton';

const FeaturedProjects = () => {
  // fetch featuredProjects from backend
  const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/projects?populate=*&filters[isFeatured][$eq]=true", "GET", {});
  const featuredProjects = res.data ? res.data["data"] : [];

  return (
    
    <div>
        <div>
          {!featuredProjects ? featuredProjects : 
           featuredProjects.map((item, index) =>(
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
        <div className={styles.seeMore} >
          <a href='/ourwork' className={styles.buttonLink}>
            <StandardButton text="See More" color="blue" link="/ourwork" />
          </a>
        </div>
      </div>
  );
};

const NoProjects = () => {
  return <h1>Oops! There are currently no projects loaded. Try again later.</h1>
}

export default FeaturedProjects;

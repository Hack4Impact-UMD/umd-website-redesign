import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import styles from '../../styles/projects/Projects.module.css';
import { useAxios, getSeason } from '../HelperFunctions';
import StandardButton from '../buttons/StandardButton';

const Projects = (props: any) => {
  let res = null;
  let projects = null;

  //check which type of projects were rendering
  if (props.isFeatured == true) {
    // fetch featuredProjects from backend
    res = useAxios(
      process.env.REACT_APP_ROOT_URL + '/api/projects?populate=*&filters[isFeatured][$eq]=true',
      'GET',
      {},
    );
    projects = res.data ? res.data['data'] : [];
  } else {
    //fetch current projects
    res = useAxios(
      process.env.REACT_APP_ROOT_URL + '/api/projects?populate=*&filters[isCurrentProject][$eq]=true',
      'GET',
      {},
    );
    projects = res.data ? res.data['data'] : [];
  }
  // fetch featuredProjects from backend

  return (
    <div>
      <div className={styles.featuredProjectCards}>
        {/*if display current projects, show current projects title*/}
        {props.isFeatured ? null : <h2 id={styles.sectionTitle}>Current Projects</h2>}
        {!projects
          ? projects
          : projects.map((item, index) => {
              const startDate = item['attributes']['startDate']
                ? getSeason((item['attributes']['startDate'] as string).substring(5, 7) as unknown as number) +
                  ' ' +
                  (item['attributes']['startDate'] as string).substring(0, 4)
                : '';
              const fullDate = startDate;
              return (
                <FeaturedProjectCard
                  key={index}
                  link={'ourwork/' + item['attributes']['path']}
                  title={item['attributes']['title']}
                  date={fullDate}
                  summary={item['attributes']['summary']}
                  image={
                    item['attributes']['image']['data']
                      ? item['attributes']['image']['data'][0]['attributes']['url']
                      : 'https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png'
                  }
                  altText={item['attributes']['imageAltText']}
                />
              );
            })}
      </div>
      {/**display see more button if showing featured projects */}
      {props.isFeatured ? (
        <div className={styles.seeMore}>
          <StandardButton text="See More" color="blue" link="/ourwork" />
        </div>
      ) : null}
    </div>
  );
};

const NoProjects = () => {
  return <h1>Oops! There are currently no projects loaded. Try again later.</h1>;
};

export default Projects;

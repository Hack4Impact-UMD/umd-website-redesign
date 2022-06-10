import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import { current_projects } from './current_projects';
import styles from '../../styles/our_work/FeaturedProjects.module.css';
import { useAxios } from '../HelperFunctions';

const FeaturedProjects = () => {

  return (
    <div>
        <div>
          <FeaturedProjectCard
            link={current_projects[5].link}
            title={current_projects[5].title}
            date={current_projects[5].date}
            summary={current_projects[5].summary}
            image={current_projects[5].image}
            altText={current_projects[5].altText}
          />
        </div>
        <div>
          <a href="https://www.google.com">
            <button aria-label="See More" className={styles.bluebtn}>
              See More
            </button>
          </a>
        </div>
      </div>
  );
};

const NoProjects = () => {
  return <h1>Oops! There are currently no projects loaded. Try again later.</h1>
}

export default FeaturedProjects;

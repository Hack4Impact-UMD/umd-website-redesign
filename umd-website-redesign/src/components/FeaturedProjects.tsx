import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import { current_projects } from './our_work/current_projects';
import styles from '../styles/FeaturedProjects.module.css';

const FeaturedProjects = () => {
  return (
    <div>
      <div className={styles.center}>
        <h1>Featured Projects</h1>
        <p>
          Short blurb about what we do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div>
        {
          <FeaturedProjectCard
            link={current_projects[0].link}
            title={current_projects[0].title}
            date={current_projects[0].date}
            summary={current_projects[0].summary}
            image={current_projects[0].image}
            altText={current_projects[0].altText}
          />
        }
      </div>
      <div>
        <FeaturedProjectCard
          link={current_projects[1].link}
          title={current_projects[1].title}
          date={current_projects[1].date}
          summary={current_projects[1].summary}
          image={current_projects[1].image}
          altText={current_projects[1].altText}
        />
      </div>
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

export default FeaturedProjects;

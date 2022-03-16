import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import { featured_projects } from './featured_projects';
import styles from '../styles/FeaturedProjects.module.css';

const FeaturedProjects = () => {
  return (
    <div>
      <div className={styles.center}>
        <h1>Featured Projects</h1>
        <p>
          Short blurb about what we do. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div>
        <FeaturedProjectCard
          link={featured_projects[0].link}
          title={featured_projects[0].title}
          date={featured_projects[0].date}
          summary={featured_projects[0].summary}
          image={featured_projects[0].image}
          altText={featured_projects[0].altText}
        />
      </div>
      <div>
        <FeaturedProjectCard
          link={featured_projects[1].link}
          title={featured_projects[1].title}
          date={featured_projects[1].date}
          summary={featured_projects[1].summary}
          image={featured_projects[1].image}
          altText={featured_projects[1].altText}
        />
      </div>
      <div>
        <FeaturedProjectCard
          link={featured_projects[2].link}
          title={featured_projects[2].title}
          date={featured_projects[2].date}
          summary={featured_projects[2].summary}
          image={featured_projects[2].image}
          altText={featured_projects[2].altText}
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

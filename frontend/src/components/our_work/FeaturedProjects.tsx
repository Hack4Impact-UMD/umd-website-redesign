import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import { current_projects } from './current_projects';
import styles from '../../styles/our_work/FeaturedProjects.module.css';

const FeaturedProjects = () => {
  return (
    <div>
      <div className={styles.center}>
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

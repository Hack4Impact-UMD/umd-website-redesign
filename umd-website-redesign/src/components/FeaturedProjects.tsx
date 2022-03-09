import React from 'react';
import FeaturedProjectCard from './FeaturedProjectCard';
import { featured_projects } from './featured_projects';

const FeaturedProjects = () => {
  return (
    <div>
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
    </div>
  );
};

export default FeaturedProjects;

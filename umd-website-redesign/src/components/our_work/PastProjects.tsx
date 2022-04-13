import React, { useState } from 'react';
import PastProjectCard from './PastProjectCard';
import { past_projects } from './past_projects';
import styles from '../../styles/our_work/PastProjects.module.css';

const PastProjects: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  let filteredData = past_projects;
  if (searchInput.length > 0) {
    filteredData = past_projects.filter((project) => {
      return project.org.match(searchInput);
    });
  }

  return (
    <div>
      <input
        type="search"
        placeholder="Search here"
        onChange={handleChange}
        value={searchInput}
      />
      <div>
        {filteredData.map((item, index) => (
          <PastProjectCard
            key={index}
            link={item.link}
            title={item.title}
            date={item.date}
            image={item.image}
            altText={item.altText}
          />
        ))}
      </div>
    </div>
  );
};

export default PastProjects;

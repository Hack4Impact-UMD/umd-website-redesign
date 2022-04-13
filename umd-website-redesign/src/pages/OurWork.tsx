import React from 'react';
import OurWorkHeader from '../components/our_work/OurWorkHeader';
import CurrentProjects from '../components/our_work/CurrentProjects';
import PastProjects from '../components/our_work/PastProjects';

const OurWork: React.FC = () => {
  return (
    <>
      <OurWorkHeader />
      <CurrentProjects />
      <PastProjects />
    </>
  );
};

export default OurWork;

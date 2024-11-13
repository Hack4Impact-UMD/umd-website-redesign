import Projects from '../../components/projects/Projects';
import HomePageLower from './HomePageLower';
import HomePageTop from './HomePageTop';
import Supporters from './Supporters';

const HomePage = () => {
  return (
    <div>
      <HomePageTop />
      <Projects isFeatured={true} />
      <HomePageLower />
      <Supporters />
    </div>
  );
};

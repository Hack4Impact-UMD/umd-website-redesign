import Projects from '../../components/projects/Projects';
import HomePageTop from './HomePageTop';
import SliderComp from './Slider';
import Supporters from './Supporters';

const HomePage = () => {
  return (
    <div>
      <HomePageTop />
      <Projects isFeatured={true} />

      <SliderComp />
      <Supporters />
    </div>
  );
};

export default HomePage;

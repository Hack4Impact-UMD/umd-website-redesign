import { getSeason } from '../../HelperFunctions';
import StandardButton from '../buttons/StandardButton';
import FeaturedProjectCard from './FeaturedProjectCard';
import styles from './Projects.module.css';

const Projects = (props: any) => {
  const res = null;
  const projects = []!;

  //check which type of projects were rendering
  if (props.isFeatured == true) {
    // fetch featuredProjects from backend
  } else {
    //fetch current projects
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
              const endDate =
                item['attributes']['Season'] && item['attributes']['Year']
                  ? ' - ' + item['attributes']['Season'] + ' ' + item['attributes']['Year']
                  : '';
              const fullDate = startDate + endDate;
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

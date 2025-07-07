import graphic from '../../components/assets/graphic.svg';
import StandardButton from '../../components/buttons/StandardButton';
import styles from './HomePage.module.css';
//first div is for background, second div is for left side text
const HomePageTop = () => {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.text}>
          <h1 className={styles.textOne}>
            Building powerful nonprofit software as a tool for{' '}
            <span className={styles.socialGoodSubText}>social good</span>
          </h1>
          <h3 className={styles.textTwo}>
            We are a student-run organization that empowers engineers, designers, activists, and humanitarians to create
            lasting social change.
          </h3>
          <div className={styles.mintbtn}>
            <StandardButton text="Learn More" color="green" link="/aboutus" />
          </div>
        </div>
        <img className={styles.graphic} src={graphic}></img>
      </div>
      <div id={styles.parentContainer}>
        <div id={styles.studentsContainer}>
          <h2>Students</h2>
          <p>
            Our members consist of current University of Maryland students interested in using tech for social good.
            Each semester, members are split into teams of Product Managers, UI/UX Designers, and Engineers and partner
            with a nonprofit organization to develop a product that will help the organization.
          </p>
          <div className={styles.bluebtn}>
            <StandardButton text="Join Us" color="blue" link="/apply/student" />
          </div>
        </div>
        <div id={styles.nonprofitsContainer}>
          <h2>Nonprofits</h2>
          <p>
            Nonprofit organizations are the pillars of our community; they focus on a variety of social issues, and
            Hack4Impact-UMD focuses on helping these organizations with any of their technical needs to improve the
            effectiveness of their work.
          </p>
          <div className={styles.bluebtn}>
            <StandardButton text="Work With Us" color="blue" link="/apply/nonprofit" />
          </div>
        </div>
      </div>
      <div className={styles.center}>
        <h2 className={styles.featuredTitle}>Featured Projects</h2>
        <p className={styles.featuredDescription}>
          We are the University of Maryland, College Park chapter of the national Hack4Impact organization, a
          student-run 501(c)(3) dedicated to building software for social impact. Each year, we partner with nonprofits
          to help them better serve their communities.
        </p>
      </div>
    </>
  );
};

export default HomePageTop;

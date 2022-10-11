import React from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import styles from '../styles/apply/NonprofitApply.module.css';
import StudentNonprofitSelector from '../components/apply/StudentNonprofitSelector';
import StandardButton from '../components/buttons/StandardButton';
import Faq, { FaqRow } from '../components/apply/Faq';
import { Link } from 'react-router-dom';

import inspireLogo from '../components/assets/npo_files/inspire_logo.svg';
import arcadiaLogo from '../components/assets/npo_files/arcadia_logo.svg';
import hamptonLogo from '../components/assets/npo_files/hampton_logo.svg';
import cadcLogo from '../components/assets/npo_files/cadc_logo.svg';
import unstoppableLogo from '../components/assets/npo_files/2unstoppable_logo.svg';
import { useAxios } from '../components/HelperFunctions';

function NonprofitApply() {
  return (
    <div className={styles.nonprofitApply}>
      {/* <Navbar /> */}
      <NonprofitApplyHeader />
      <Carousel />
      <HowToApply />
      <div className={styles.applyButton}>
        <StandardButton
          color="green"
          text="Apply"
          externalLink={true}
          link="https://docs.google.com/forms/d/e/1FAIpQLSfaeqcwOGt3QR0h4Lmo-fwW4mA108jpeb0p06upiivwxpDArw/viewform?usp=sf_link"
        />
      </div>
      <div className={styles.faq}>
        <FaqSection />
      </div>
    </div>
  );
}

function NonprofitApplyHeader() {
  return (
    <div className={styles.nonprofitApplyHeader}>
      <div className={styles.nonprofitApplyHeaderContent}>
        <h1>Apply</h1>
        <StudentNonprofitSelector curr={'nonprofit'} />
        <p>
          At Hack4Impact, we understand that nonprofit organizations are a valuable asset to our community. We want to
          use our software and web development skills to help nonprofits. Our collaborations with nonprofits are
          semester-long (around 3-4 months), and we will work with you to develop a software product that suits your
          organization’s needs.
        </p>
      </div>
    </div>
  );
}

function Carousel() {
  /* adjust scrolling speed with the easing function here */
  const animation = { duration: 5000, easing: (t: any) => t / 3 };
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free',
    slides: { origin: 'center', perView: 4, spacing: 30 },
    /* next 3 props implement auto scrolling */
    created(s) {
      s.moveToIdx(4, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  // query all projects to be used to find the recent project.
  const res = useAxios(process.env.REACT_APP_ROOT_URL + "/api/projects?populate=*", "GET", {});
  const allProjects: any[] = res.data ? res.data["data"] : [];
  const cleanedProjects = allProjects.map(x => x["attributes"]);
  const past_projects = cleanedProjects;

  return (
    <div ref={ref} className={`keen-slider ${styles.carousel}`}>
      <Link to={getRecentProject("Inspire", past_projects)}> {/* Don't know the link to inspire logo*/}
        <img className={`keen-slider__slide ${styles.orgLogo}`} src={inspireLogo} />
      </Link>
      <Link to={getRecentProject("Arcadia", past_projects)}>
        <img className={`keen-slider__slide ${styles.orgLogo}`} src={arcadiaLogo} />
      </Link>
      <Link to={getRecentProject("WISE-E", past_projects)}>
        <img className={`keen-slider__slide ${styles.orgLogo}`} src={hamptonLogo} />
      </Link>
      <Link to={getRecentProject("CaDC", past_projects)}>
        <img className={`keen-slider__slide ${styles.orgLogo}`} src={cadcLogo} />
      </Link>
      <Link to={getRecentProject("2Unstoppable", past_projects)}>
      <img className={`keen-slider__slide ${styles.orgLogo}`} src={unstoppableLogo} />
      </Link>
    </div>
  );
}

/*
  Get the most recent project from an organization. It will redirect to the 'ourwork' page if organization does not 
  have any projects in database. 
*/
function getRecentProject(organization: string, past_projects: any[]) {
  let path = '/ourwork/';
  const organizationProjects = past_projects.filter(project => (project['title'] as string).includes(organization));
  if (organizationProjects.length > 0) {
    let recentProject = organizationProjects[0];
    organizationProjects.forEach(project => {
      const recentProjectDate = new Date(recentProject["startDate"] as string);
      const curProjectDate = new Date(project["startDate"] as string);
      if (curProjectDate > recentProjectDate) {
        recentProject = project;
      }
    })
    path += recentProject["path"] as string
  }
  return path
}


function HowToApply() {
  return (
    <div className={styles.howToApply}>
      <h2>How to Apply</h2>
      <p>
        Please fill out our application form below, and our sourcing team will reach out to the email provided in the
        application within 2 weeks of the application being submitted. In this initial email, we will further explain
        the role of Hack4Impact-UMD and set up a time to virtually meet with your organization. <br /> <br />
        During the first meeting, we will go over the timeline of working with Hack4Impact-UMD, clarify any questions
        you may have, and learn more about your work. <br /> <br />
        We will also discuss any tech needs that your organization may need and potential collaborations that could be
        done between us. After the initial meeting, we will follow up with whether or not we would like to collaborate
        on the discussed project and any resulting next steps.
      </p>
    </div>
  );
}

function FaqSection() {
  return (
    <Faq>
      <FaqRow
        question={<h3>What types of projects do you undertake?</h3>}
        answer={
          <p>
            Most of the projects we undertake are web applications. Common examples of problems we tackle include 
            volunteer tracking forms, member directories, and data tracking softwares. Check out our projects page 
            to see some of our previous work, and feel free to contact us with any project ideas!{' '}
          </p>
        }
      />
      <FaqRow 
        question={<h3>How much does this cost?</h3>} 
        answer={
          <p>
            These projects are free or low cost (around $5 to $15 per month) for the website and hosting expenses. We are 
            building software to better help you serve your community, and we know how tight money can be so we 
            try to keep these expenses as low as possible.
          </p>} />
      <FaqRow 
        question={<h3>What does the project timeline look like?</h3>} 
        answer={
          <p>
            Most development begins at the start of the academic semseter and continues until around the end of the semester. 
            Throughout all of this, we will remain in constant contact with you to ensure that we are building an application 
            that you will want to use.
          </p>} />
      <FaqRow 
        question={<h3>How much involvement is expected from nonprofits?</h3>} 
        answer={
          <p>
            We strongly believe in continuous and transparent communication to ensure that your project is something that you 
            will be happy with. This means we will be asking for constant feedback throughout the development cycle.
          </p>} />
      <FaqRow 
        question={<h3>How does long term maintenance work?</h3>} 
        answer={
          <p>
            Once we hand the product off to you around the end of the academic semester, we want to give you time to experiment 
            with it and find anything that needs to be changed. <br /> <br /> 
            Once we end the semester, we will no longer be able to make 
            additions as easily due to limited resources on our end. If you encounter bugs on the site, we will attempt to 
            correct these issues, but cannot guarantee that we will be able to.
          </p>} />
      <br/><br/><br/>
    </Faq>
  );
}

export default NonprofitApply;

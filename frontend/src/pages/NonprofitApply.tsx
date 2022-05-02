import React from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import styles from '../styles/apply/NonprofitApply.module.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import StudentNonprofitSelector from '../components/apply/StudentNonprofitSelector';
import ApplyButton from '../components/apply/ApplyButton';
import Faq, { FaqRow } from '../components/apply/Faq';

import inspireLogo from '../components/assets/inspire_logo.svg';
import arcadiaLogo from '../components/assets/arcadia_logo.svg';
import hamptonLogo from '../components/assets/hampton_logo.svg';
import cadcLogo from '../components/assets/cadc_logo.svg';
import unstoppableLogo from '../components/assets/2unstoppable_logo.svg';

function NonprofitApply() {
  return (
    <div className={styles.studentApply}>
      <Navbar />
      <StudentApplyHeader />
      <Carousel />
      <HowToApply />
      <div className={styles.applyButton}>
        <ApplyButton />
      </div>
      <div className={styles.faq}>
        <FaqSection />
      </div>
      <div className={styles.footerDiv}>
        <Footer />
      </div>
    </div>
  );
}

function StudentApplyHeader() {
  return (
    <div className={styles.studentApplyHeader}>
      <div className={styles.studentApplyHeaderContent}>
        <h1>Apply</h1>
        <StudentNonprofitSelector curr={'nonprofit'} />
        <h2>
          At Hack4Impact, we understand that nonprofit organizations are a valuable asset to our community. We want to
          use our software and web development skills to help nonprofits. Our collaborations with nonprofits are
          semester-long (around 3-4 months), and we will work with you to develop a software product that suits your
          organization’s needs.
        </h2>
      </div>
    </div>
  );
}

function Carousel() {
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free',
    slides: { origin: 'center', perView: 4, spacing: 30 },
  });

  return (
    <div ref={ref} className={`keen-slider ${styles.carousel}`}>
      <img className={`keen-slider__slide ${styles.orgLogo}`} src={inspireLogo} />
      <img className={`keen-slider__slide ${styles.orgLogo}`} src={arcadiaLogo} />
      <img className={`keen-slider__slide ${styles.orgLogo}`} src={hamptonLogo} />
      <img className={`keen-slider__slide ${styles.orgLogo}`} src={cadcLogo} />
      <img className={`keen-slider__slide ${styles.orgLogo}`} src={unstoppableLogo} />
    </div>
  );
}

function HowToApply() {
  return (
    <div className={styles.howToApply}>
      <h1>How to Apply</h1>
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
        question={<p>What types of projects do you undertake?</p>}
        answer={
          <p>
            Most students spend about 3 hours per week on Hack4Impact project work. Each project team determines their
            own schedule, but most meet for about 1 hour per week to plan and delegate tasks. The other time is spent
            working on the project individually. <br /> <br />
            We also hold general body meetings every week, which are about 1 hour long. H4I holds many other events
            during the year, such as volunteer events, tech talks, and social events. These events are not mandatory,
            but we highly encourage our members to attend. <br /> <br /> Leadership roles, such as executive directors,
            project managers, and tech leads will spend more time, up to 10 hours a week.{' '}
          </p>
        }
      />
      <FaqRow question={<p>How much does this cost?</p>} answer={<p>0</p>} />
      <FaqRow question={<p>What does the project timeline look like?</p>} answer={<p>MERN</p>} />
      <FaqRow question={<p>How much involvement is expected from nonprofits?</p>} answer={<p>asdfasdf</p>} />
      <FaqRow question={<p>How does long term maintenance work?</p>} answer={<p>asdfasdf</p>} />
    </Faq>
  );
}

export default NonprofitApply;

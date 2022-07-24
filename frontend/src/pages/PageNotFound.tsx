import React from 'react';
import styles from '../styles/PageNotFound/PageNotFound.module.css';
import StandardButton from '../components/buttons/StandardButton';

function PageNotFound() {
  return (
    <div className={styles.studentApply}>
      {/* <Navbar /> */}
      <PageNotFoundHeader />
    </div>
  );
}

function PageNotFoundHeader() {
  return (
    <div className={styles.pageNotFoundHeader}>
      <div className={styles.pageNotFoundHeaderContent}>
        <h1 className={'alternateHeader'}>404: Thats an Error.</h1>
        <h3> Are you sure this link is correct? If this was a mistake, click below to return to the main page.</h3>
        <StandardButton
          color="green"
          text="Back To Home"
          link="/"
        />
      </div>
    </div>
  );
}


export default PageNotFound;

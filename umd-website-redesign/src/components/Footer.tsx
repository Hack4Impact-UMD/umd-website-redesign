import React from 'react';
import { ReactComponent as Wordmark } from './assets/wordmark.svg';
import { ReactComponent as IgLogo } from './assets/ig.svg';
import { ReactComponent as FbLogo } from './assets/fb.svg';
import { ReactComponent as GhLogo } from './assets/gh.svg';
import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.Footer}>
      <FooterInfo />
      <FooterCols />
    </div>
  );
}

// Logo, email, and social media icons component.
function FooterInfo() {
  return (
    <div className={styles.FooterInfo}>
      <Wordmark title={'Hack4Impact Logo'} />
      <p>
        {"Couldn't find what you're looking for?\nContact us at "}
        <a href={'mailto:umd@hack4impact.org'}>{'umd@hack4impact.org'}</a>
        {' to get in touch!'}
      </p>
      <FooterIcons />
    </div>
  );
}

// Social Media Icons component.
// Used in FooterInfo
function FooterIcons() {
  return (
    <div className={styles.FooterIcons}>
      <a href={'https://www.instagram.com/hack4impactumd'}>
        <IgLogo />
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <FbLogo />
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <GhLogo />
      </a>
    </div>
  );
}

// Column links component.
function FooterCols() {
  return (
    <div className={styles.FooterColumns}>
      <FooterCol1 />
      <FooterCol2 />
      <FooterCol3 />
    </div>
  );
}

function FooterCol1() {
  return (
    <div className={styles.FooterColumn}>
      <h2>Follow Us</h2>
      <p>
        <a href={'https://www.instagram.com/hack4impactumd'}>Instagram</a>
      </p>
      <p>
        <a href={'https://www.facebook.com/hack4impactumd'}>Facebook</a>
      </p>
      <p>
        <a href={'https://github.com/Hack4Impact-UMD'}>GitHub</a>
      </p>
      <p>
        <a href={'https://terplink.umd.edu/organization/hack4impact'}>TerpLink</a>
      </p>
    </div>
  );
}

function FooterCol2() {
  return (
    <div className={styles.FooterColumn}>
      <h2>Learn More</h2>
      <p>
        <a href={'https://www.google.com/'}>About Us</a>
      </p>
      <p>
        <a href={'https://www.google.com/'}>Our Work</a>
      </p>
    </div>
  );
}

function FooterCol3() {
  return (
    <div className={styles.FooterColumn}>
      <h2>Get Involved</h2>
      <p>
        <a href={'https://www.google.com/'}>Student Applications</a>
      </p>
      <p>
        <a href={'https://www.google.com/'}>Nonprofit Proposals</a>
      </p>
    </div>
  );
}

export default Footer;

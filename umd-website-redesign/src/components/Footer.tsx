import React from 'react';
import styles from './Footer.module.css';
/* Avoiding inline svg to avoid excess code and id overlaps. */
import wordmark from './assets/wordmark.svg';
import igLogo from './assets/ig.svg';
import fbLogo from './assets/fb.svg';
import ghLogo from './assets/gh.svg';
/* mobile */
import background_svg from './assets/background.svg';

function Footer() {
  const footerBackground = {
    backgroundImage: `url(${background_svg})`,
  };

  return (
    <div className={styles.Footer} style={footerBackground}>
      <div className={styles.FooterContent}>
        <FooterInfo />
        <FooterCols />
        <div className={styles.SocialIconsMobile}>
          <FooterIcons />
        </div>
      </div>
    </div>
  );
}

// Logo, Email blurb, icons
function FooterInfo() {
  return (
    <div className={styles.FooterInfo}>
      <img src={wordmark} className={styles.WordMark} />
      <p>
        {"Couldn't find what you're looking for?"}
        <br />
        {'Contact us at '}
        <a href={'mailto:umd@hack4impact.org'}>{'umd@hack4impact.org'}</a>
        {' to get in touch!'}
      </p>
      <div className={styles.SocialIconsDesktop}>
        <FooterIcons />
      </div>
    </div>
  );
}

// Social Media Icons component.
// Used in FooterInfo
function FooterIcons() {
  return (
    <div className={styles.FooterIcons}>
      <a href={'https://www.instagram.com/hack4impactumd'}>
        <img src={igLogo} />
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <img src={fbLogo} />
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <img src={ghLogo} />
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

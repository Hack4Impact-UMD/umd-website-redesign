import React, { useState } from 'react';
import styles from '../../styles/footer/Footer.module.css';
/* Avoiding inline svg to avoid excess code and id overlaps. */
import wordmark from '../assets/wordmark.svg';
import igLogo from '../assets/footer/ig.svg';
import fbLogo from '../assets/footer/fb.svg';
import ghLogo from '../assets/footer/gh.svg';
import igHoverLogo from '../assets/footer/ig_hover.svg';
import fbHoverLogo from '../assets/footer/fb_hover.svg';
import ghHoverLogo from '../assets/footer/gh_hover.svg';

function Footer() {
  return (
    <div className={styles.Footer}>
      <div className={styles.FooterContent}>
        <FooterInfo />
        <FooterCols />
        {/* Include two sets of icons to simplify implementation. Other is in FooterInfo */}
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
// TODO: remove mobile animation by adding media queries in react.
function FooterIcons() {
  const [igClass, setIgClass] = useState(styles.SocialIcon);
  const [igClassHover, setIgClassHover] = useState(`${styles.SocialIcon} ${styles.hidden}`);
  const [fbClass, setFbClass] = useState(styles.SocialIcon);
  const [fbClassHover, setFbClassHover] = useState(`${styles.SocialIcon} ${styles.hidden}`);
  const [ghClass, setGhClass] = useState(styles.SocialIcon);
  const [ghClassHover, setGhClassHover] = useState(`${styles.SocialIcon} ${styles.hidden}`);

  return (
    <div className={styles.FooterIcons}>
      <a href={'https://www.instagram.com/hack4impactumd'}>
        <img
          src={igLogo}
          onMouseEnter={() => {
            setIgClass(`${styles.SocialIcon} ${styles.hidden}`);
            setIgClassHover(styles.SocialIcon);
          }}
          className={igClass}
        />
        <img
          src={igHoverLogo}
          onMouseOut={() => {
            setIgClass(styles.SocialIcon);
            setIgClassHover(`${styles.SocialIcon} ${styles.hidden}`);
          }}
          className={igClassHover}
        />
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <img
          src={fbLogo}
          onMouseEnter={() => {
            setFbClass(`${styles.SocialIcon} ${styles.hidden}`);
            setFbClassHover(styles.SocialIcon);
          }}
          className={fbClass}
        />
        <img
          src={fbHoverLogo}
          onMouseOut={() => {
            setFbClass(styles.SocialIcon);
            setFbClassHover(`${styles.SocialIcon} ${styles.hidden}`);
          }}
          className={fbClassHover}
        />
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <img
          src={ghLogo}
          onMouseEnter={() => {
            setGhClass(`${styles.SocialIcon} ${styles.hidden}`);
            setGhClassHover(styles.SocialIcon);
          }}
          className={ghClass}
        />
        <img
          src={ghHoverLogo}
          onMouseOut={() => {
            setGhClass(styles.SocialIcon);
            setGhClassHover(`${styles.SocialIcon} ${styles.hidden}`);
          }}
          className={ghClassHover}
        />
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

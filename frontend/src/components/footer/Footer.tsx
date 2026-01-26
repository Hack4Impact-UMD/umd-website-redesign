import React from 'react';
import styles from '../../styles/footer/Footer.module.css';
import wordmark from '../assets/h4i_files/h4i_wordmark.svg';
/*
 * Separate SVGs for mobile/desktop so that styling one doesn't affect the other.
 * Manually added unique IDs in SVG files.
 */
import IgLogoSvg from '../assets/footer/ig.svg?react';
import FbLogoSvg from '../assets/footer/fb.svg?react';
import GhLogoSvg from '../assets/footer/gh.svg?react';
import IgLogoSvg2 from '../assets/footer/ig2.svg?react';
import FbLogoSvg2 from '../assets/footer/fb2.svg?react';
import GhLogoSvg2 from '../assets/footer/gh2.svg?react';

function Footer() {
  return (
    <div className={styles.Footer}>
      <div className={styles.FooterContent}>
        <FooterInfo />
        <FooterCol1 />
        <FooterCol2 />
        <FooterCol3 />
        <FooterIconsMobile />
      </div>
    </div>
  );
}

function FooterInfo() {
  return (
    <div className={styles.FooterInfo}>
      <img src={wordmark} className={styles.WordMark} alt="Hack4Impact wordmark" />
      <p>
        {"Can't find what you're looking for?"}
        <br />
        {'Contact us at '}
        <a href={'mailto:umd@hack4impact.org'}>{'umd@hack4impact.org'}</a>
        {' to get in touch!'}
      </p>
      <FooterIconsDesktop />
    </div>
  );
}

/*
 * Desktop social media icons. Due to inline svg weirdness, good idea to only use this
 * component once per page.
 */
function FooterIconsDesktop() {
  return (
    <div className={styles.FooterIconsDesktop}>
      <a href={'https://www.instagram.com/hack4impactumd'}>
        <div className={styles.SocialIcon}>
          <IgLogoSvg />
        </div>
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <div className={styles.SocialIcon}>
          <FbLogoSvg />
        </div>
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <div className={styles.SocialIcon}>
          <GhLogoSvg />
        </div>
      </a>
    </div>
  );
}

function FooterIconsMobile() {
  return (
    <div className={styles.FooterIconsMobile}>
      <a href={'https://www.instagram.com/hack4impactumd'}>
        <div className={styles.SocialIcon}>
          <IgLogoSvg2 />
        </div>
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <div className={styles.SocialIcon}>
          <FbLogoSvg2 />
        </div>
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <div className={styles.SocialIcon}>
          <GhLogoSvg2 />
        </div>
      </a>
    </div>
  );
}

function FooterCol1() {
  return (
    <div className={styles.FooterColumn}>
      <h3>Follow Us</h3>
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
      <h3>Learn More</h3>
      <p>
        <a href={'/aboutus'}>About Us</a>
      </p>
      <p>
        <a href={'/ourwork'}>Our Work</a>
      </p>
    </div>
  );
}

function FooterCol3() {
  return (
    <div className={styles.FooterColumn}>
      <h3>Get Involved</h3>
      <p>
        <a href={'/apply/student'}>Student Applications</a>
      </p>
      <p>
        <a href={'/apply/nonprofit'}>Nonprofit Proposals</a>
      </p>
    </div>
  );
}

export default Footer;

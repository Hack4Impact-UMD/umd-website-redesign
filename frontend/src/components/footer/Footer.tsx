import React, { useState } from 'react';
import styles from '../../styles/footer/Footer.module.css';
import wordmark from '../assets/wordmark.svg';
/* Use svgs for desktop, to make hover easier. */
import { ReactComponent as IgLogoSvg } from '../assets/footer/ig.svg';
import { ReactComponent as FbLogoSvg } from '../assets/footer/fb.svg';
import { ReactComponent as GhLogoSvg } from '../assets/footer/gh.svg';
/* Use pngs for mobile. No hover needed. Duplicating svg element leads to issues */
import igLogo from '../assets/footer/ig.svg';
import fbLogo from '../assets/footer/fb.svg';
import ghLogo from '../assets/footer/gh.svg';

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

// Logo, Email blurb, icons
function FooterInfo() {
  return (
    <div className={styles.FooterInfo}>
      <img src={wordmark} className={styles.WordMark} />
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
          <GhLogoSvg />
        </div>
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <div className={styles.SocialIcon}>
          <FbLogoSvg />
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
          <img src={igLogo} />
        </div>
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <div className={styles.SocialIcon}>
          <img src={fbLogo} />
        </div>
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <div className={styles.SocialIcon}>
          <img src={ghLogo} />
        </div>
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
      <h2>Get Involved</h2>
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

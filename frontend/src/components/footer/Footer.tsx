import wordmark from '../assets/h4i_files/h4i_wordmark.svg';
import styles from './Footer.module.css';
import { useLocation } from 'react-router-dom';
import fbLogo from '../assets/footer/fb.svg';
import fbLogo2 from '../assets/footer/fb2.svg';
import ghLogo from '../assets/footer/gh.svg';
import ghLogo2 from '../assets/footer/gh2.svg';
import igLogo from '../assets/footer/ig.svg';
import igLogo2 from '../assets/footer/ig2.svg';

function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
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
      <img src={wordmark} className={styles.WordMark} alt="Hack4Impact Wordmark" />
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
          <img src={igLogo} alt="Instagram Logo" />
        </div>
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <div className={styles.SocialIcon}>
          <img src={fbLogo} alt="Facebook Logo" />
        </div>
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <div className={styles.SocialIcon}>
          <img src={ghLogo} alt="GitHub Logo" />
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
          <img src={igLogo2} alt="Instagram Logo Mobile" />
        </div>
      </a>
      <a href={'https://www.facebook.com/hack4impactumd'}>
        <div className={styles.SocialIcon}>
          <img src={fbLogo2} alt="Facebook Logo Mobile" />
        </div>
      </a>
      <a href={'https://github.com/Hack4Impact-UMD'}>
        <div className={styles.SocialIcon}>
          <img src={ghLogo2} alt="GitHub Logo Mobile" />
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

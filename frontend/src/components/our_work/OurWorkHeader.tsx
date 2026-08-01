import type { OurWorkContent } from '@/content/our-work';
import styles from '../../styles/our_work/OurWorkHeader.module.css';

type OurWorkHeaderProps = OurWorkContent['header'];

const OurWorkHeader = ({ title, subtitle, image, imageAlt }: OurWorkHeaderProps) => {
  return (
    <header className={styles.header}>
      <img className={styles.heroImage} src={image} alt={imageAlt} />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
    </header>
  );
};

export default OurWorkHeader;

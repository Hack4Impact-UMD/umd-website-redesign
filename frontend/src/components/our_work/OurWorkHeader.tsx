import { useCallback } from 'react';
import styles from '../../styles/our_work/OurWorkHeader.module.css';
import { getOurWorkContent } from '@/api/content';
import { defaultOurWorkContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';
import heroImage from '../assets/h4igroup_photo.jpg';

const OurWorkHeader = () => {
  const ourWorkContent = useApiData(useCallback(() => getOurWorkContent(), []), defaultOurWorkContent);
  const header = ourWorkContent.data.header;

  return (
    <header className={styles.header}>
      <img
        className={styles.heroImage}
        src={resolveMediaUrl(header.image) || heroImage}
        alt={header.imageAlt}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <h1 className={styles.title}>{header.title}</h1>
          <p className={styles.subtitle}>{header.subtitle}</p>
        </div>
      </div>
    </header>
  );
};

export default OurWorkHeader;

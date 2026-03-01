import React, { useState } from 'react';
import styles from '../styles/people/Person.module.css';
import default_pfp from '../components/assets/icons/default_pfp.png';
import { FADE_IN_TRANSITION } from '../constants/animations';
import { resolveMediaUrl } from '@/lib/media';

interface PersonProps {
  memberName?: string;
  team?: string;
  role?: string;
  pronouns?: string;
  src?: string | null;
}

function Person({ memberName, team, role, pronouns, src }: PersonProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageSrc = () => {
    if (!src) return default_pfp;
    const resolved = resolveMediaUrl(src);
    return resolved || default_pfp;
  };

  const imageSrc = getImageSrc();

  return (
    <div className={styles.Person}>
      <img
        src={imageError ? default_pfp : imageSrc}
        alt={memberName || 'Team member'}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
        style={{ opacity: imageLoaded ? 1 : 0, transition: FADE_IN_TRANSITION }}
      />
      <h2>{memberName}</h2>
      <p className={styles.team}>{team}</p>
      <p>{role}</p>
      <p className={styles.Pronouns}>{pronouns}</p>
    </div>
  );
}

export default Person;

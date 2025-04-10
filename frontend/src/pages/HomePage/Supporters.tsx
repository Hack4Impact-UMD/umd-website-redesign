import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSponsors } from '../../firebaseFunctions/FirebaseCalls';
import { Tiers } from '../../types/Sponsors';
import styles from './Supporters.module.css';

const Supporters = () => {
  let tiers = Object.values(Tiers);
  tiers = tiers.slice(0, (tiers.length - 1) / 2 + 1);
  const [sponsors, setSponsors] = useState<any[]>([]);
  useEffect(() => {
    getSponsors().then((res) => {
      setSponsors(res.map((sponsorInformation) => sponsorInformation.sponsor));
    });
  }, []);
  return (
    <div id={styles.supportersContainer}>
      <h2>Our Supporters</h2>
      {tiers.map((tier, ind) => {
        return (
          <>
            <h4 className={styles.divider} key={ind}>
              <span>{(tier as string).toUpperCase()}</span>
            </h4>
            <div className={styles.tierContainer}>
              {sponsors.map((sponsor) => {
                return (
                  sponsor.tier === tier && (
                    <img src={sponsor.image.downloadURL} alt={sponsor.image.name} className={styles.supporterLogo} />
                  )
                );
              })}
            </div>
          </>
        );
      })}

      <Link className={styles.navLinks} to={'/contactus'}>
        {'Interested in partnering? Contact us!'}
      </Link>
    </div>
  );
};

export default Supporters;

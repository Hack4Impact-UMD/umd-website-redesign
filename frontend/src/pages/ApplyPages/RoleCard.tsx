import bootcampLogo from '../../components/assets/rolecard/bootcamp.svg';
import designerLogo from '../../components/assets/rolecard/designer.svg';
import engineerLogo from '../../components/assets/rolecard/engineer.svg';
import pmLogo from '../../components/assets/rolecard/pm.svg';
import bg1 from '../../components/assets/rolecard/RoleCardBackground1.svg';
import bg2 from '../../components/assets/rolecard/RoleCardBackground2.svg';
import bgHover1 from '../../components/assets/rolecard/RoleCardBackgroundHover1.svg';
import bgHover2 from '../../components/assets/rolecard/RoleCardBackgroundHover2.svg';
import bgm1 from '../../components/assets/rolecard/RoleCardBackgroundMobile1.svg';
import bgm2 from '../../components/assets/rolecard/RoleCardBackgroundMobile2.svg';
import sourcingLogo from '../../components/assets/rolecard/sourcing.svg';
import techleadLogo from '../../components/assets/rolecard/techlead.svg';
import styles from './RoleCard.module.css';

/*
 * RoleCard Component used in Apply pages.
 *
 * Adapted from ValueCard.
 *
 * Props:
 * revBackground (Boolean): if true, gradient is from blue to green.
 * Otherwise, gradient is from green to blue.
 * mainText (String): Header text
 * hoverText (String): Body text
 * role (int): Determines the logo shown. 1 = engineer, 2 = designer, 3 = pm, 4 = tech lead, 5 = bootcamp.
 *
 */
function RoleCard(props: any) {
  let roleCardClass: string;
  let bgMain: string;
  let bgHover: string;
  if (props.revBackground) {
    /* add additional rev class for mobile */
    roleCardClass = `${styles.roleCard} ${styles.rev}`;
    bgMain = props.screenWidth > 800 ? bg2 : bgm2;
    bgHover = bgHover2;
  } else {
    roleCardClass = styles.roleCard;
    bgMain = props.screenWidth > 800 ? bg1 : bgm1;
    bgHover = bgHover1;
  }

  let roleLogo: string;
  switch (props.role) {
    case 1:
      roleLogo = engineerLogo;
      break;
    case 2:
      roleLogo = designerLogo;
      break;
    case 3:
      roleLogo = pmLogo;
      break;
    case 4:
      roleLogo = techleadLogo;
      break;
    case 5:
      roleLogo = bootcampLogo;
      break;
    case 6:
      roleLogo = sourcingLogo;
      break;
    default:
      roleLogo = engineerLogo;
  }

  return (
    <div className={roleCardClass}>
      <div className={styles.cardContent}>
        <div className={styles.cardFront} style={{ backgroundImage: `url(${bgMain})` }}>
          <div className={styles.cardContentWrapper}>
            <img src={roleLogo} className={styles.logo} />
            <br />
            <span className={styles.roleCardTextMain}>
              <h2>{props.mainText}</h2>
            </span>
          </div>
        </div>

        <div className={styles.cardBack} style={{ backgroundImage: `url(${bgHover})` }}>
          <div className={styles.cardContentWrapper}>
            <span className={styles.roleCardTextSub}>
              <p>{props.hoverText}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleCard;

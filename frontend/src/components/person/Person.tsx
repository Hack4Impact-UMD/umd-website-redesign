import default_pfp from '../../components/assets/icons/default_pfp.png';
import styles from './Person.module.css';

/*
 * Person component
 * Props:
 * src: path to image. default to globe if not given.
 * memberName, team, role, pronouns: strings for each field.
 */
function Person(props: any) {
  let imageSrc: string;
  if (props.src == undefined || props.src == null) {
    imageSrc = default_pfp;
  } else {
    imageSrc = props.src;
  }

  return (
    <div className={styles.Person}>
      <img src={imageSrc} />
      <h2>{props.memberName}</h2>
      <p className={styles.team}>{props.team}</p>
      <p>{props.role}</p>
      <p className={styles.Pronouns}>{props.pronouns}</p>
    </div>
  );
}

export default Person;

import Person from '../../components/person/Person';
import styles from './AboutUs.module.css';
import ValueCard from './ValueCard';

import { useEffect, useState } from 'react';
import headerDesktop from '../../components/assets/backgrounds/about_us/aboutus_header2023.png';
import headerMobile from '../../components/assets/backgrounds/about_us/aboutus_header_mobile2023.png';
import { getMembers } from '../../firebaseFunctions/FirebaseCalls';
import { Member } from '../../types/Member';

function AboutUs() {
  const [members, setMembers] = useState<Member[]>([]);
  const execOrder = [
    'Executive Director',
    'Director of Product',
    'Director of Engineering',
    'Director of Design',
    'Director of Education',
    'Director of Finance',
    'Director of Events',
    'Director of Recruitment',
    'Director of Sourcing',
    'Senior Advisor',
  ];
  const boardMembers = members.filter((member: Member) =>
    member['roles'].find((role: any) => execOrder.includes(role.role) && role['isDisplayRole']),
  );

  useEffect(() => {
    getMembers(true).then(async (res) => {
      setMembers(res.map((item) => item.member));
    });
  }, []);
  const beOpenMinded =
    'Our process depends on openness to different people, topics, and perspectives. We embrace difference and work against intolerance to foster an inclusive environment. Our goal is to expose our members to the vast opportunities and daunting challenges in our work.';

  const goBeyondTechnology =
    'Technology is only one tool we use in our greater mission for social impact. Technology alone is not enough. We learn from, work with, and are inspired by others who are tackling social problems using a multitude of tools.';

  const developWithCare =
    'We build with others in mind. Empathy and compassion are crucial to serving our partner organizations and members. When we embark on projects, we work to deeply understand the people who we are helping.';

  return (
    <div className={styles.aboutUs}>
      <div className={styles.headerDiv}>
        <picture>
          {/* background image should change when navbar changes */}
          <source srcSet={headerDesktop} media={'(min-width: 700px)'} />
          <img src={headerMobile} className={styles.headerImg}></img>
        </picture>
      </div>
      <div className={styles.ourMission}>
        <h2>Our Mission</h2>
        <p>
          Hack4Impact-UMD is a student organization at the University of Maryland, College Park. Founded in Fall 2020 by{' '}
          <a href="https://www.linkedin.com/in/lydia-hu/">Lydia Hu</a>,{' '}
          <a href="https://www.linkedin.com/in/simin-li-88088b/">Simin Li</a>, and{' '}
          <a href="https://www.linkedin.com/in/abbie-tran-a47893153/">Abbie Tran</a>, the club focuses on using tech
          skills for helping the community while introducing students to a professional working environment and other
          post-graduation options compared to industry and academia.
        </p>
      </div>
      <div className={styles.valuesCardsDiv}>
        <h2>Our Values</h2>
        <div className={styles.valuesCards}>
          <ValueCard mainText={'Go Beyond Technology'} hoverText={goBeyondTechnology} />
          <ValueCard mainText={'Develop with Care'} hoverText={developWithCare} revBackground={true} />
          <ValueCard mainText={'Be Open Minded'} hoverText={beOpenMinded} />
        </div>
      </div>
      <div className={styles.execBoardDiv}>
        <h2>Executive Board</h2>
        <div className={styles.execBoardPhotos}>
          {!boardMembers
            ? boardMembers
            : boardMembers
                .sort((a, b) => {
                  const aRole = a['roles'].find((e) => e['isDisplayRole'] == true);
                  const bRole = b['roles'].find((e) => e['isDisplayRole'] == true);
                  if (aRole && bRole) {
                    return execOrder.indexOf(aRole['role'].toString()) - execOrder.indexOf(bRole['role'].toString());
                  }
                  return 0;
                })
                .map((item, index) => (
                  <Person
                    key={index}
                    memberName={item['firstName'] + ' ' + item['lastName']}
                    team={''}
                    role={
                      item['roles'].find((role: any) => role['isDisplayRole'])
                        ? item['roles'].find((role: any) => role['isDisplayRole'])!['role'].toString()
                        : ''
                    }
                    pronouns={item['pronouns']}
                    src={item['image']['downloadURL']}
                  />
                ))}
        </div>
      </div>
      <div className={styles.teamMembersDiv}>
        <h2>Team Members</h2>
        <div className={styles.teamMembersPhotos}>
          {!members
            ? members
            : // render team members
              members.map(
                (item: Member, index: number) =>
                  !boardMembers.includes(item) && (
                    <Person
                      key={index}
                      memberName={item['firstName'] + ' ' + item['lastName']}
                      team={''}
                      role={
                        item['roles'].find((role: any) => role['isDisplayRole'])
                          ? item['roles'].find((role: any) => role['isDisplayRole'])!['role'].toString()
                          : ''
                      }
                      pronouns={item['pronouns']}
                      src={item['image']['downloadURL']}
                    />
                  ),
              )}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

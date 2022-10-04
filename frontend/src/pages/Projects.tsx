import React from 'react';
import HomePageTop from '../components/projects/ProjectsTop';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import style from '../styles/projects/ProjectsTop.module.css'
import styles from '../styles/about_us/AboutUs.module.css';
import Person from '../components/Person';
import placeholder from '../components/assets/placeholder.png';

const Home: React.FC = () => {
  return (
    <div>
      <div className={style.mydiv}>
      <Navbar/>
      <HomePageTop/>
      <ExecBoard/>
      <Footer/>
      </div>
    </div>
  );
};

function ExecBoard() {
    return (
      <div className={styles.execBoardDiv}>
        <h1>Executive Board</h1>
        <div className={styles.execBoardPhotos}>
          <Person src={placeholder} memberName={'Surabi Ramamurthy'} role={'Executive Director'} pronouns={'she/her'} />
          <Person src={placeholder} memberName={'Daneil Nguyen'} role={'Director of Product'} pronouns={'he/him'} />
          <Person src={placeholder} memberName={'Vrundal Shah'} role={'Director of Engineering'} pronouns={'he/him'} />
          <Person src={placeholder} memberName={'Katherine Wang'} role={'Director of Design'} pronouns={'she/her'} />
          <Person src={placeholder} memberName={'Stevin Berit'} role={'Director of Sourcing'} pronouns={'he/him'} />
          <Person
            src={placeholder}
            memberName={'Sadena Rishindran'}
            role={'Co-Director of Education'}
            pronouns={'she/her'}
          />
          <Person src={placeholder} memberName={'Miranda Song'} role={'Co-Director of Education'} pronouns={'she/her'} />
          <Person src={placeholder} memberName={'Anaya Nadig'} role={'Director of Events'} pronouns={'she/her'} />
          <Person src={placeholder} memberName={'Ben Lin'} role={'Director of Recruitment'} pronouns={'he/him'} />
        </div>
      </div>
    );
  }

export default Home;

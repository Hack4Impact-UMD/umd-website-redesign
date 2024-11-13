import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoutIcon from '../../assets/admin/logout-black.svg';
import members from '../../assets/admin/members.svg';
import projects from '../../assets/admin/projects.png';
import sponsors from '../../assets/admin/sponsors.png';
import x from '../../assets/admin/x.svg';
import { useAuth } from '../../auth/AuthProvider';
import LogOutConfirmation from './LogOutConfirmation/LogOutConfirmation';
import styles from './NavigationBar.module.css';

const NavigationBar = (): JSX.Element => {
  const authContext = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.id === 'logOut') {
      setShowPopup(true);
    }
  };

  return (
    <>
      <div className={menuOpen ? styles.background : ''} onClick={() => setMenuOpen(!menuOpen)} />
      <nav className={showPopup ? styles.navigationBarPopupOpen : styles.navigationBar}>
        {authContext?.loading ? (
          <></>
        ) : (
          <>
            <div className={styles.titleContainer}>
              <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <img src={x} alt="Exit" /> : <MenuIcon style={{ color: 'e3853a', width: '30px' }} />}
              </button>
            </div>
            <div className={menuOpen ? styles.openMenu : styles.closedMenu}>
              <h2 className={styles.header}>Welcome</h2>
              <hr className={styles.breakLine}></hr>
              <div
                className={styles.linkOptionsContainer}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <div>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.linkOptions} ${styles.highlightOn}`
                        : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
                    }
                    to="/admin/members"
                    id="members"
                  >
                    <div className={styles.tab}>
                      <img className={styles.iconActive} src={members} alt="House Icon" />
                      Members
                    </div>
                  </NavLink>
                </div>

                <div>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.linkOptions} ${styles.highlightOn}`
                        : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
                    }
                    to="/admin/projects"
                    id="projects"
                  >
                    <div className={styles.tab}>
                      <img className={styles.iconActive} src={projects} alt="Graduation cap icon" />
                      Projects
                    </div>
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.linkOptions} ${styles.highlightOn}`
                        : `${styles.linkOptionsUnselected} ${styles.highlightOff}`
                    }
                    to="/admin/sponsors"
                    id="sponsors"
                    end
                  >
                    <div className={styles.tab}>
                      <img className={styles.iconActive} src={sponsors} alt="Gear icon" />
                      Sponsors
                    </div>
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className={`${styles.linkOptionsUnselected} ${styles.highlightOff}`}
                    id="logOut"
                    onClick={handleClick}
                    to=""
                    end
                  >
                    <div className={styles.tab}>
                      <img alt="Logout icon" src={logoutIcon} className={styles.iconActive} />
                      Log Out
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
            {showPopup && (
              <LogOutConfirmation
                open={showPopup}
                onClose={() => {
                  setShowPopup(!showPopup);
                }}
              />
            )}
          </>
        )}
      </nav>
    </>
  );
};

export default NavigationBar;

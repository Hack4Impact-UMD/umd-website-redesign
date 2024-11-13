import { VisibilityOff as EyeClosed, Visibility as EyeOpened } from '@mui/icons-material';
import { AuthError } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import graphic from '../../../components/assets/graphic.svg';
import { useAuth } from '../../../components/auth/AuthProvider';
import { authenticateUser } from '../../../firebaseFunctions/AuthFunctions';
import styles from './AdminLoginPage.module.css';
import ForgotPassword from './ForgotPasswordModal/ForgotPassword';

const AdminLoginPage = () => {
  const auth = useAuth();
  useEffect(() => {
    console.log(auth.token);
  }, [auth]);
  const navigate = useNavigate();
  const [openForgotModal, setOpenForgotModal] = useState<boolean>(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [loginDetails, setLoginDetails] = useState<{
    email: string;
    pass: string;
  }>({ email: '', pass: '' });

  const handleSignIn = async () => {
    setFailureMessage('');
    if (loginDetails.email != '' && loginDetails.pass != '') {
      authenticateUser(loginDetails.email, loginDetails.pass)
        .then(() => {
          navigate('/');
        })
        .catch((error: any) => {
          const code = (error as AuthError).code;
          if (code === 'auth/too-many-requests') {
            setFailureMessage(
              '*Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.',
            );
          } else {
            setFailureMessage('*Incorrect email address or password');
          }
        });
    } else {
      setFailureMessage('*Incorrect email address or password');
    }
  };

  return (
    <>
      <div className={styles.splitScreen}>
        <ForgotPassword
          open={openForgotModal}
          onClose={() => {
            setOpenForgotModal(!openForgotModal);
          }}
        />
        <div className={styles.leftSide}>
          <div className={styles.loginRectangle}>
            <p className={styles.welcomeSign}>Welcome!</p>
            <p className={styles.labelProperties}>Email</p>
            <input
              className={styles.textBoxEmail}
              placeholder="Enter your email"
              value={loginDetails.email}
              onChange={(event) =>
                setLoginDetails({
                  ...loginDetails,
                  email: event?.target.value,
                })
              }
            />
            <p className={styles.labelProperties}>Password</p>
            <div className={styles.passwordContainer}>
              <input
                className={styles.textBoxPass}
                type={isVisiblePassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={loginDetails.pass}
                onChange={(event) =>
                  setLoginDetails({
                    ...loginDetails,
                    pass: event?.target.value,
                  })
                }
              />
              <button className={styles.visiblityToggleButton} onClick={() => setIsVisiblePassword(!isVisiblePassword)}>
                {isVisiblePassword ? <EyeOpened className={styles.eyeImg} /> : <EyeClosed className={styles.eyeImg} />}
              </button>
            </div>
            <div className={styles.forgotPasswordContainer}>
              <p className={styles.forgotPassword} onClick={() => setOpenForgotModal(true)}>
                Forgot Password?
              </p>
            </div>
            <div className={styles.loginBox}>
              <button className={styles.loginButton} onClick={() => handleSignIn()}>
                Login
              </button>
            </div>
            {failureMessage != '' ? (
              <div>
                <p className={styles.errorMessage}>*{failureMessage}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className={styles.rightSide}>
          <img className={styles.bigImage} src={graphic} />
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;

import { type AuthError } from '@firebase/auth';
import { useState } from 'react';
import Modal from '../../../../components/admin/ModalWrapper/Modal';
import x from '../../../../components/assets/admin/x.svg';
import Loading from '../../../../components/loading/Loading';
import { sendResetEmail } from '../../../../firebaseFunctions/AuthFunctions';
import styles from './ForgotPassword.module.css';

interface forgotModalType {
  open: boolean;
  onClose: any;
}

const ForgotPassword = ({ open, onClose }: forgotModalType): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = (): void => {
    setLoading(true);
    if (submitted) {
      handleOnClose();
    } else {
      // validate email input
      if (/^[\w]+@[\w]+(\.\w+)+$/.test(email)) {
        // send reset email
        sendResetEmail(email)
          .then(() => {
            setSubmitted(true);
          })
          .catch((error) => {
            const code = (error as AuthError).code;
            if (code != 'auth/user-not-found') {
              setErrorMessage('Backend Error');
            }
            setSubmitted(true);
          });
      } else if (!email) {
        setErrorMessage('*This field is required');
      } else {
        setErrorMessage('*Invalid email address');
      }
    }
    setLoading(false);
  };

  const handleOnClose = (): void => {
    onClose();
    setSubmitted(false);
    setErrorMessage('');
    setLoading(false);
  };

  return (
    <Modal
      height={200}
      open={open}
      onClose={() => {
        handleOnClose();
      }}
    >
      <>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.close}
            onClick={() => {
              handleOnClose();
            }}
          >
            <img src={x} alt="Close popup" />
          </button>
        </div>
        <div className={styles.content}>
          {submitted ? (
            <div className={styles.submit}>
              {errorMessage == 'Backend Error'
                ? 'Error occurred while trying to send reset password email. Please try again later'
                : 'Thank you! Check your email for further instructions.'}
            </div>
          ) : (
            <>
              <h2 className={styles.title}>Reset Password</h2>
              <p className={styles.error}>{errorMessage}</p>
              <input
                autoFocus
                className={styles.email}
                type="email"
                placeholder="Email"
                required
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handlePasswordReset();
                  }
                }}
              />
            </>
          )}
        </div>

        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => {
                handlePasswordReset();
              }}
              disabled={loading}
            >
              {submitted ? 'Back to Login' : <div>{loading ? <Loading /> : 'Reset Password'}</div>}
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ForgotPassword;

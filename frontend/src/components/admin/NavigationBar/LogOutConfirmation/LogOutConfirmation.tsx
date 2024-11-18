import { useState } from 'react';
import { useNavigate } from 'react-router';
import { logOut } from '../../../../firebaseFunctions/AuthFunctions';
import x from '../../../assets/admin/x.svg';
import Modal from '../../ModalWrapper/Modal';
import styles from './LogOutConfirmation.module.css';

interface popupModalType {
  onClose: () => void;
  open: any;
}

const LogOutConfirmation = ({ onClose, open }: popupModalType): React.ReactElement => {
  const [submittedError, setSubmittedError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleConfirm = (): void => {
    onClose();
    logOut()
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setSubmittedError(true);
      });
  };

  const handleOnClose = (): void => {
    setSubmittedError(false);
    onClose();
  };

  return (
    <Modal
      height={200}
      open={open}
      onClose={() => {
        handleOnClose();
      }}
    >
      <div>
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
          <h2 className={styles.title}>Log Out Confirmation</h2>
          <p>{submittedError ? 'Log out failed. Try again later.' : "Are you sure you're ready log out?"}</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsContainer}>
            {submittedError ? (
              <></>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleConfirm();
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    handleOnClose();
                  }}
                >
                  No
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogOutConfirmation;

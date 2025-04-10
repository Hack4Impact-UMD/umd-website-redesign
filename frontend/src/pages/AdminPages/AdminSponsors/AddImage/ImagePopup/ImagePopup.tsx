import { Button, Modal, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../../../components/loading/Loading';
import { deleteSponsor, updateSponsor } from '../../../../../firebaseFunctions/FirebaseCalls';
import styles from './ImagePopup.module.css';

const ImagePopup = ({ mode, open, handleClose, info, image, id }: any) => {
  console.log(info);
  console.log(image);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    submitted: false,
  });
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setStatus({ ...status, loading: true });
    let promise = undefined;
    if (mode == 'Edit') {
      promise = updateSponsor(info, id, image);
    } else if (mode == 'View') {
      // Doesn't make sense semantically but simplified the code by
      // having mode == 'View' and mode == 'Delete' do the same thing
      promise = deleteSponsor(info.image.ref, id);
    }
    promise!
      .then(() => {
        setStatus({ loading: false, error: false, submitted: true });
      })
      .catch((error) => {
        console.log(error);
        setStatus({ loading: false, error: true, submitted: true });
      });
  };
  const handleFullClose = () => {
    if (status.submitted && !status.error) {
      navigate('../admin/sponsors');
    } else {
      setStatus({ loading: false, error: false, submitted: false });
      handleClose();
    }
  };
  return (
    <>
      <Modal open={open} onClose={handleFullClose}>
        <Paper className={styles.background}>
          <div className={styles.center}>
            <p className={styles.header}>{mode == 'Edit' ? ' Edit ' : ' Delete '} Sponsor</p>
            {status.submitted ? (
              <p className={styles.text}>
                {status.error
                  ? 'An error occurred. Please try again later.'
                  : `Success! Upon closing this, you will be redirected to the main sponsors page.
                    `}
              </p>
            ) : (
              <p className={styles.text}>
                Are you sure you want to
                {mode == 'Edit' ? ' edit the ' : ' delete the '}
                sponsor?
              </p>
            )}

            {status.loading ? (
              <Loading />
            ) : status.submitted ? (
              <></>
            ) : (
              <Button type="submit" variant="outlined" className={styles.submitButton} onClick={() => handleSubmit()}>
                {mode == 'Edit' ? ' Edit ' : ' Delete '} Sponsor
              </Button>
            )}
          </div>
        </Paper>
      </Modal>
    </>
  );
};
export default ImagePopup;

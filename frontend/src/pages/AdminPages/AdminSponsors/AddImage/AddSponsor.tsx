import CancelIcon from '@mui/icons-material/Cancel';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { FormControl, InputLabel, MenuItem, Select, Snackbar, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from '../../../../components/admin/NavigationBar/NavigationBar';
import { addSponsor } from '../../../../firebaseFunctions/FirebaseCalls';
import Sponsor, { Tiers } from '../../../../types/Sponsors';
import styles from './AddSponsor.module.css';
import ImagePopup from './ImagePopup/ImagePopup';

const AddSponsor = () => {
  const location = useLocation();

  const [mode, setMode] = useState<string>(location.state && location.state.actualRow ? 'View' : 'Add');
  const [openPopup, setOpenPopup] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const [information, setInformation] = useState<Sponsor>(
    location.state
      ? location.state.actualRow.sponsor
      : {
          tier: '',
          image: { name: '', ref: '', downloadURL: '' },
        },
  );
  const [imageContent, setImageContent] = useState<File>();

  const style = {
    fontFamily: 'Ubuntu, serif',
    WebkitTextFillColor: 'black',
  };

  const handleSave = () => {
    if (!information.tier || !information.image.name) {
      setSnackbar({ open: true, message: 'Please fill out all the fields' });
      return;
    }
    addSponsor(information.tier, imageContent!)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Post saved successfully. Reloading page shortly',
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((_) =>
        setSnackbar({
          open: true,
          message: 'Failed to save post. Try again later.',
        }),
      );
  };
  return (
    <div>
      <ImagePopup
        open={openPopup}
        mode={mode}
        handleClose={() => {
          setOpenPopup(false);
          setMode('View');
        }}
        id={location?.state?.actualRow?.id || ''}
        info={information}
        image={imageContent}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
      <NavigationBar />
      <div className={styles.rightPane}>
        <div className={styles.contentContainer}>
          <div className={styles.header}>
            <p>{mode == 'View' ? 'View' : mode == 'Edit' ? 'Edit' : 'Add New'} Sponsor</p>
            <div className={styles.buttons}>
              {!location?.state?.actualRow ? (
                <button className={styles.addMemberButton} onClick={() => handleSave()}>
                  <Tooltip title="Save">
                    <SaveIcon />
                  </Tooltip>
                </button>
              ) : mode == 'View' ? (
                <>
                  {' '}
                  <button
                    className={styles.addMemberButton}
                    onClick={() => {
                      setMode('Edit');
                    }}
                  >
                    <Tooltip title="Edit">
                      <CreateIcon />
                    </Tooltip>
                  </button>
                  <button
                    className={styles.addMemberButton}
                    onClick={() => {
                      setMode('View');
                      setOpenPopup(true);
                    }}
                  >
                    <Tooltip title="Delete">
                      <DeleteIcon />
                    </Tooltip>
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.addMemberButton} onClick={() => setOpenPopup(true)}>
                    <Tooltip title="Save">
                      <SaveIcon />
                    </Tooltip>
                  </button>
                  <button className={styles.addMemberButton} onClick={() => window.location.reload()}>
                    <Tooltip title="Cancel Changes">
                      <CancelIcon />
                    </Tooltip>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={styles.innerContainer}>
            <FormControl>
              <InputLabel id="tier-label" sx={{ marginTop: '5px' }}>
                Tier
              </InputLabel>
              <Select
                // MenuProps={{
                //   PaperProps: { sx: { maxHeight: 300, maxWidth: 200 } },
                // }}
                labelId="tier-label"
                id="tier"
                value={information.tier}
                onChange={(event) => {
                  if (mode === 'View') return;
                  setInformation({
                    ...information,
                    tier: event.target.value as Tiers,
                  });
                }}
                className={styles.primarySelect}
                variant="outlined"
                required
                label="Tier"
                disabled={mode === 'View'}
              >
                {Object.keys(Tiers)
                  .filter((v) => {
                    return Number.isNaN(parseInt(v));
                  })
                  .map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {location?.state?.actualRow && mode == 'View' ? (
              <>
                <img src={information.image.downloadURL} alt={information.image.name} className={styles.imageDisplay} />
              </>
            ) : (
              <>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="upload"
                    accept=".jpeg, .jpg, .png"
                    onChange={async (e) => {
                      const maxFileSize = 1048576 * 20; // 20MB
                      if (e.target.files) {
                        const currFile = e.target.files[0];
                        if (!currFile?.size) {
                          return;
                        }
                        if (currFile?.size > maxFileSize) {
                          alert('File is too big');
                          e.target.value = '';
                          return;
                        }
                        setImageContent(currFile);
                        setInformation({ ...information, image: { ...information.image, name: currFile.name } });
                      }
                    }}
                    className={styles.fileInput}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSponsor;

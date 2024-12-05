import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import styles from './AdminSponsors.module.css';

interface SponsorFormData {
  image: File | null;
  link: string;
  tier: string;
}

const AdminSponsors = () => {
  const [formData, setFormData] = useState<SponsorFormData>({
    image: null,
    link: '',
    tier: '',
  });

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
      setUploadedFileName(e.target.files[0].name); // Display file name
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({ ...formData, tier: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Add logic to submit the form data
    alert('Sponsor added successfully!');
    setFormData({ image: null, link: '', tier: '' });
    setUploadedFileName(null);
  };

  return (
    <div>
      <NavigationBar />
      <div className={styles.rightPane}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>

          <TextField
            label="Link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel id="tier-label">Tier</InputLabel>
            <Select
              labelId="tier-label"
              name="tier"
              value={formData.tier}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="bronze">Bronze</MenuItem>
              <MenuItem value="silver">Silver</MenuItem>
              <MenuItem value="gold">Gold</MenuItem>
              <MenuItem value="platinum">Platinum</MenuItem>
            </Select>
          </FormControl>

          <div className={styles.uploadSection}>
            <FormControl fullWidth>
              <Typography variant="body2" color="textSecondary">
                Please ensure the image maintains visual alignment with other sponsor logos.
              </Typography>
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {uploadedFileName && (
                <Typography variant="body2" color="textSecondary">
                  Uploaded: {uploadedFileName}
                </Typography>
              )}
            </FormControl>
          </div>

          <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
            Add Sponsor
          </Button>
        </form>
      </div>

    </div>
  );
};

export default AdminSponsors;

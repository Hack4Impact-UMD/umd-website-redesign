import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import styles from './AdminMembers.module.css';

interface MemberFormData {
  firstName: string;
  lastName: string;
  pronouns: string;
  avatar: File | null;
  memberDisplayStatus: boolean;
  role: string;
}

const AdminMembers = () => {
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: '',
    lastName: '',
    pronouns: '',
    avatar: null,
    memberDisplayStatus: true,
    role: '',
  });

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] });
      setUploadedFileName(e.target.files[0].name); // Set uploaded file name
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Add logic to submit the form data
    alert('Member added successfully!');
    setFormData({
      firstName: '',
      lastName: '',
      pronouns: '',
      avatar: null,
      memberDisplayStatus: true,
      role: '',
    });
    setUploadedFileName(null); // Reset file name
  };

  return (
    <div>
      <NavigationBar />
      <div className={styles.rightPane}>
        <div className={styles.formContainer}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
          <TextField
            label="Pronouns"
            name="pronouns"
            value={formData.pronouns}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
          <FormControl className={styles.formControl}>
            <InputLabel id="display-status-label">Member Display Status</InputLabel>
            <Select
              labelId="display-status-label"
              name="memberDisplayStatus"
              value={String(formData.memberDisplayStatus)}
              onChange={(e) => setFormData({ ...formData, memberDisplayStatus: e.target.value === 'true' })}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={styles.formControl}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleSelectChange}
            >
              <MenuItem value="Engineer">Engineer</MenuItem>
              <MenuItem value="Tech Lead">TL</MenuItem>
              <MenuItem value="Project Manager">PM</MenuItem>
              <MenuItem value="Designer">Designer</MenuItem>
              <MenuItem value="Bootcamp">Bootcamp</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={styles.fullWidth}>
            <Button variant="contained" component="label" className={styles.avatarButton}>
              Upload Avatar
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {uploadedFileName && (
              <Typography variant="body2" color="textSecondary">
                Uploaded: {uploadedFileName}
              </Typography>
            )}
          </FormControl>
          <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
            Add Member
          </Button>
        </div>
      </div>

    </div>
  );
};

export default AdminMembers;

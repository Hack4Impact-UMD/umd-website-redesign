import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { addMember, uploadImage } from '../../../firebaseFunctions/firebaseCalls'; // Import your Firebase functions
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] });
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.avatar) {
      try {
        // Upload the avatar image first
        const avatarUrl = await uploadImage(formData.avatar, 'members'); // 'members' as the folder name
        // Once uploaded, proceed with adding the member to Firestore

        // You can now add the member data, including the avatar URL, to Firestore
        // Assuming you have a function to handle adding a member to Firestore (e.g., addMember)
        await addMember({ ...formData, avatar: avatarUrl });

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
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('There was an error uploading the avatar. Please try again.');
      }
    } else {
      alert('Please upload an avatar image.');
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className={styles.rightPane}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
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
                onChange={(e) =>
                  setFormData({ ...formData, memberDisplayStatus: e.target.value === 'true' })
                }
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
              <Button
                variant="contained"
                component="label"
                className={styles.avatarButton}
                disabled={loading}
              >
                Upload Avatar
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {uploadedFileName && (
                <Typography variant="body2" color="textSecondary">
                  Uploaded: {uploadedFileName}
                </Typography>
              )}
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Member'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMembers;

import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Typography, TextField, Button, Grid, Grid2 } from '@mui/material';
import styles from './AdminMembers.module.css';

interface MemberFormData {
  firstName: string;
  lastName: string;
  pronouns: string;
  avatar: File | null;
  memberDisplayStatus: string;
  role: string;
}

const AdminMembers = () => {
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: '',
    lastName: '',
    pronouns: '',
    avatar: null,
    memberDisplayStatus: '',
    role: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // following line would come from Firebase Utilities
    // addMemberToDatabase(formData);
    alert('Member added successfully!');
    setFormData({ firstName: '', lastName: '', pronouns: '', avatar: null, memberDisplayStatus: '', role: '' });
  };


  return (
    <div>
      <NavigationBar />
      <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth required />
      <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth required />
      <TextField label="Pronouns" name="pronouns" value={formData.pronouns} onChange={handleChange} fullWidth required />
      <TextField label="Role" name="role" value={formData.role} onChange={handleChange} fullWidth required />
      <TextField label="Member Display Status" name="memberDisplayStatus" value={formData.memberDisplayStatus} onChange={handleChange} fullWidth required />

      <Button variant="contained" component="label">
        Upload Avatar
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      <Button type="submit" variant="contained" color="primary">Add Member</Button>

    </div>
    
  );
};

export default AdminMembers;

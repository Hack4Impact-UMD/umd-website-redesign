import { Button, TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import styles from './AdminProjects.module.css';

interface ProjectFormData {
  title: string;
  image: File | null;
  isFeatured: boolean;
  isCurrent: boolean;
  repoURL: string;
  siteURL: string;
  imageAltText: string;
  projectSemesters: string[];
  seasonName: string;
  seasonYear: string;
  members: string[];
  summary: string;
  blurb: string;
}

const AdminProjects = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    image: null,
    isFeatured: false,
    isCurrent: false,
    repoURL: '',
    siteURL: '',
    imageAltText: '',
    projectSemesters: [],
    seasonName: '',
    seasonYear: '',
    members: [],
    summary: '',
    blurb: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, name: keyof ProjectFormData) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleMultiSelectChange = (e: SelectChangeEvent<string[]>, name: keyof ProjectFormData) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Add logic to submit the form data
    alert('Project added successfully!');
    setFormData({
      title: '',
      image: null,
      isFeatured: false,
      isCurrent: false,
      repoURL: '',
      siteURL: '',
      imageAltText: '',
      projectSemesters: [],
      seasonName: '',
      seasonYear: '',
      members: [],
      summary: '',
      blurb: '',
    });
  };

  return (
    <div>
      <NavigationBar />
      <div className={styles.rightPane}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Is Featured</InputLabel>
            <Select
              name="isFeatured"
              value={String(formData.isFeatured)}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'true' })}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Is Current</InputLabel>
            <Select
              name="isCurrent"
              value={String(formData.isCurrent)}
              onChange={(e) => setFormData({ ...formData, isCurrent: e.target.value === 'true' })}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Repo URL"
            name="repoURL"
            value={formData.repoURL}
            onChange={handleChange}
            fullWidth
          />
          
          <TextField
            label="Site URL"
            name="siteURL"
            value={formData.siteURL}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Image Alt Text"
            name="imageAltText"
            value={formData.imageAltText}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Project Semesters</InputLabel>
            <Select
              multiple
              value={formData.projectSemesters}
              onChange={(e) => handleMultiSelectChange(e, 'projectSemesters')}
              input={<OutlinedInput />}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Spring 2023', 'Fall 2023', 'Spring 2024'].map((semester) => (
                <MenuItem key={semester} value={semester}>
                  <Checkbox checked={formData.projectSemesters.includes(semester)} />
                  <ListItemText primary={semester} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Season Name</InputLabel>
            <Select
              name="seasonName"
              value={formData.seasonName}
              onChange={(e) => handleSelectChange(e, 'seasonName')}
            >
              <MenuItem value="Fall">Fall</MenuItem>
              <MenuItem value="Spring">Spring</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Season Year"
            name="seasonYear"
            value={formData.seasonYear}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Members</InputLabel>
            <Select
              multiple
              value={formData.members}
              onChange={(e) => handleMultiSelectChange(e, 'members')}
              input={<OutlinedInput />}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Member 1', 'Member 2', 'Member 3'].map((member) => (
                <MenuItem key={member} value={member}>
                  <Checkbox checked={formData.members.includes(member)} />
                  <ListItemText primary={member} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            multiline
            rows={3}
            className={styles.fullWidth}
          />

          <TextField
            label="Blurb"
            name="blurb"
            value={formData.blurb}
            onChange={handleChange}
            multiline
            rows={2}
            className={styles.fullWidth}
          />

          <Button variant="contained" component="label" className={styles.imageButton}>
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
            Add Project
          </Button>
        </form>
      </div>

    </div>
  );
};

export default AdminProjects;

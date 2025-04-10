/* this is super broken presently */

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { getProjects } from '../../../firebaseFunctions/FirebaseCalls';
import styles from './AdminProjectsDisplay.module.css';

const AdminProjectsDisplay = () => {
  const [projects, setProjects] = useState<{ project: any; id: string }[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<{ project: any; id: string }[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects(false);
        setProjects(allProjects);
        setFilteredProjects(allProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = projects.filter((projectData) => {
      const { name = '', description = '', status = '' } = projectData.project;
      return (
        name.toLowerCase().includes(value) ||
        description.toLowerCase().includes(value) ||
        status.toLowerCase().includes(value)
      );
    });

    setFilteredProjects(filtered);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Project Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 180 },
  ];

  const rows = filteredProjects.map((projectData) => ({
    id: projectData.id,
    name: projectData.project.name,
    description: projectData.project.description,
    status: projectData.project.status,
    createdAt: projectData.project.createdAt,
  }));

  return (
    <div>
      <NavigationBar />
      <div className={styles.rightPane}>
        <div>
          <input
            type="text"
            placeholder="Search projects"
            value={search}
            onChange={handleSearchChange}
            className={styles.inputField}
          />
          <div className={styles.dataGridContainer}>
            <DataGrid rows={rows} columns={columns} className={styles.dataGrid} sortingOrder={['asc', 'desc']} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectsDisplay;

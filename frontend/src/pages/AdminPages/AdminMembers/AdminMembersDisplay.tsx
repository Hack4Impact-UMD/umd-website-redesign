import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { getMembersData } from '../../../firebaseFunctions/firebaseCalls';
import styles from './AdminMembersDisplay.module.css';

const AdminMembersDisplay = () => {
  const [members, setMembers] = useState<{ member: any; id: string }[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<{ member: any; id: string }[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allMembers = await getMembersData();
        setMembers(allMembers);
        setFilteredMembers(allMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = members.filter((memberData) => {
      const { firstName = '', lastName = '', pronouns = '', role = '' } = memberData.member;
      return (
        firstName.toLowerCase().includes(value) ||
        lastName.toLowerCase().includes(value) ||
        pronouns.toLowerCase().includes(value) ||
        role.toLowerCase().includes(value)
      );
    });

    setFilteredMembers(filtered);
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'pronouns', headerName: 'Pronouns', width: 120 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'memberDisplayStatus', headerName: 'Display Status', width: 160 },
  ];

  const rows = filteredMembers.map((memberData) => ({
    id: memberData.id,
    firstName: memberData.member.firstName,
    lastName: memberData.member.lastName,
    pronouns: memberData.member.pronouns,
    role: memberData.member.role,
    memberDisplayStatus: memberData.member.memberDisplayStatus,
  }));

  return (
    <div>
      <NavigationBar />
        <div className={styles.rightPane}>
          <div>
            <input
              type="text"
              placeholder="Search members"
              value={search}
              onChange={handleSearchChange}
              className={styles.inputField}
            />
            <div className={styles.dataGridContainer}>
              <DataGrid
                rows={rows}
                columns={columns}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                className={styles.dataGrid}
                sortingOrder={['asc', 'desc']}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminMembersDisplay;

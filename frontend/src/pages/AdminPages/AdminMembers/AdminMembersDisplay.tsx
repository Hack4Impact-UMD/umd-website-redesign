import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { getMembersData } from '../../../firebaseFunctions/FirebaseCalls';
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
      const { firstName = '', lastName = '', pronouns = '', roles = [] } = memberData.member;
      const displayRole = roles.find((roleObj: any) => roleObj.isDisplayRole)?.role || 'N/A';

      return (
        firstName.toLowerCase().includes(value) ||
        lastName.toLowerCase().includes(value) ||
        pronouns.toLowerCase().includes(value) ||
        displayRole.toLowerCase().includes(value)
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

  const rows = filteredMembers.map((memberData) => {
    const roles = memberData.member.roles || [];
    const displayRole = roles.find((roleObj: any) => roleObj.isDisplayRole)?.role || 'No Display Role Assigned';

    return {
      id: memberData.id,
      firstName: memberData.member.firstName || 'N/A',
      lastName: memberData.member.lastName || 'N/A',
      pronouns: memberData.member.pronouns || 'N/A',
      role: displayRole,
      memberDisplayStatus: memberData.member.memberDisplayStatus ? 'Visible' : 'Hidden',
    };
  });

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
              className={styles.dataGrid}
              sortingOrder={['asc', 'desc']}
              autoHeight
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMembersDisplay;

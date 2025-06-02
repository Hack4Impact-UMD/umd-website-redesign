import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { getMembers } from '../../../firebaseFunctions/FirebaseCalls';
import styles from './AdminMembersDisplay.module.css';

const AdminMembersDisplay = () => {
  const [members, setMembers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allMembers = await getMembers(false);
        // Flatten the data structure for the DataGrid
        const flattenedMembers = allMembers.map((member) => ({
          id: member.id,
          firstName: member.member.firstName || 'N/A',
          lastName: member.member.lastName || 'N/A',
          pronouns: member.member.pronouns || 'N/A',
          role: member.member.roles || 'N/A',
          alumni: member.member.alumni ? 'True' : 'False',
        }));
        setMembers(flattenedMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 150,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
    },
    {
      field: 'pronouns',
      headerName: 'Pronouns',
      width: 120,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 200,
    },
    {
      field: 'alumni',
      headerName: 'Alumni',
      width: 120,
    },
  ];

  const DataGridStyles = {
    border: 10,
    borderColor: 'rgba(189,189,189,0.75)',
    borderRadius: 4,
    '& .MuiDataGrid-row:nth-child': {
      backgroundColor: 'rgba(224, 224, 224, 0.75)',
      fontFamily: `"Source-Serif 4", serif`,
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#2264E555',
      borderRadius: 0,
      fontFamily: `"Source-Serif 4", serif`,
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: 'rgba(224, 224, 224, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#2264E535',
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <NavigationBar />
      <div className={styles.rightPane}>
        <div>
          <div className={styles.buttonHolder}>
            <button className={styles.addMemberButton} onClick={() => navigate('./add')}>
              Add Member
            </button>
          </div>
          <div className={styles.dataGridContainer}>
            <DataGrid
              checkboxSelection
              rows={members}
              columns={columns}
              columnHeaderHeight={50}
              rowHeight={40}
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true, // Enables the search bar in the toolbar
                  quickFilterProps: { debounceMs: 500 }, // Adds debounce for better performance
                },
              }}
              sx={DataGridStyles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMembersDisplay;

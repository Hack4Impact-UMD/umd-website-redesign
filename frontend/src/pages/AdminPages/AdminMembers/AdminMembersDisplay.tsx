import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { getMembersData } from '../../../firebaseFunctions/FirebaseCalls';
import styles from './AdminMembersDisplay.module.css';

const AdminMembersDisplay = () => {
  const [members, setMembers] = useState<{ member: any; id: string }[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<{ member: any; id: string }[]>([]);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allMembers = await getMembersData();
        setMembers(allMembers);
        setFilteredMembers(allMembers);
        console.log(members);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  const columns: GridColDef[] = [
    {
      valueGetter: (params: any) => params?.row.member.firstName,
      type: 'string',
      field: 'firstName',
      headerName: 'First Name',
      width: 150,
      renderCell: (params) => <div>{params?.row.member.firstName || 'N/A'}</div>,
    },
    {
      valueGetter: (params: any) => params?.row.member.lastName || 'N/A',
      type: 'string',
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
      renderCell: (params) => <div>{params?.row.member.lastName || 'N/A'}</div>,
    },
    {
      valueGetter: (params: any) => params?.row.member.pronouns || 'N/A',
      type: 'string',
      field: 'pronouns',
      headerName: 'Pronouns',
      width: 120,
      renderCell: (params) => <div>{params?.row.member.pronouns || 'N/A'}</div>,
    },
    {
      valueGetter: (params: any) => params?.row.member.role || 'N/A',
      type: 'string',
      field: 'role',
      headerName: 'Role',
      width: 200,
      renderCell: (params) => <div>{params?.row.member.role || 'N/A'}</div>,
    },
    {
      valueGetter: (params: any) => (params?.row.member.alumni ? 'True' : 'False'),
      type: 'string',
      field: 'alumni',
      headerName: 'Alumni',
      width: 120,
      renderCell: (params) => <div>{params?.row.member.alumni ? 'True' : 'False'}</div>,
    },
  ];

  const QuickSearchToolbar = () => {
    return (
      <Box
        sx={{
          padding: '5px',
          backgroundColor: 'rgba(224, 224, 224, 0.75)',
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  };

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
                  showQuickFilter: true,
                },
              }}
              // slots={{ toolbar: QuickSearchToolbar }}
              // slotProps={{
              //   toolbar: {
              //     showQuickFilter: true,
              //   },
              // }}
              sx={DataGridStyles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMembersDisplay;

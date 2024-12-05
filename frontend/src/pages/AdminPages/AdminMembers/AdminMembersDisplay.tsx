import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { getMembersData } from '../../../firebaseFunctions/FirebaseCalls'; // Assuming this is where the function is located

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  role: string;
  memberDisplayStatus: boolean;
}

const AdminMembersDisplay = () => {
  const [members, setMembers] = useState<{ member: any; id: string }[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<{ member: any; id: string }[]>([]);
  const [search, setSearch] = useState<string>('');

  // Fetch members data when the component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allMembers = await getMembersData();
        setMembers(allMembers); // Set the members data
        setFilteredMembers(allMembers); // Initially display all members
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = members.filter((memberData) => {
      const { firstName, lastName, pronouns, role } = memberData.member;
      return (
        firstName.toLowerCase().includes(value.toLowerCase()) ||
        lastName.toLowerCase().includes(value.toLowerCase()) ||
        pronouns.toLowerCase().includes(value.toLowerCase()) ||
        role.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredMembers(filtered);
  };

  // Columns definition for the DataGrid
  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'pronouns', headerName: 'Pronouns', width: 120 },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'memberDisplayStatus',
      headerName: 'Display Status',
      width: 160,
      // ,
      // valueGetter: (params) => (params.row.memberDisplayStatus ? 'Visible' : 'Hidden')
    },
  ];

  // Rows need to be formatted as the data for the DataGrid
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
      <input
        type="text"
        placeholder="Search members"
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: 16, padding: 8, width: '100%' }}
      />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          // disableColumnMenu={false}
          sortingOrder={['asc', 'desc']}
        />
      </div>
    </div>
  );
};

export default AdminMembersDisplay;

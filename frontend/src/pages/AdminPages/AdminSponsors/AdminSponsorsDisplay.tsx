import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../components/admin/NavigationBar/NavigationBar';
import { getSponsors } from '../../../firebaseFunctions/FirebaseCalls';
import Sponsor, { Tiers } from '../../../types/Sponsors';
import styles from './AdminSponsorsDisplay.module.css';

const AdminSponsorsDisplay = () => {
  const [sponsors, setSponsors] = useState<{ sponsor: Sponsor; id: string }[]>([]);
  const [state, setState] = useState({
    loading: true,
    error: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getSponsors()
      .then((allSponsors) => {
        setSponsors(allSponsors);
        setState({ loading: false, error: false });
      })
      .catch(() => {
        setState({ loading: false, error: true });
      });
  }, []);

  const columns: GridColDef[] = [
    {
      valueGetter: (_, row: any) => row.sponsor.tier.toString(),
      type: 'string',
      field: 'tier',
      headerName: 'Tier',
      width: 150,
      renderCell: (params) => <div>{params?.row.sponsor.tier || 'N/A'}</div>,
      sortComparator: (v1, v2) => {
        return Tiers[v1] > Tiers[v2] ? 1 : -1;
      },
    },
    {
      type: 'string',
      field: 'image',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img
            style={{
              display: 'block',
              width: '100px',
            }}
            src={params?.row.sponsor.image.downloadURL}
          />
        </div>
      ),
      sortable: false,
    },
  ];

  const QuickSearchToolbar = () => {
    return (
      <Box
        sx={{
          padding: '5px',
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
        <div className={styles.buttonHolder}>
          <button className={styles.addMemberButton} onClick={() => navigate('./add')}>
            Add Sponsor
          </button>
        </div>
        <div className={styles.dataGridContainer}>
          {state.loading ? (
            <div className={styles.errorContainer}> Loading Data </div>
          ) : state.error ? (
            <div className={styles.errorContainer}> Error Obtaining Data </div>
          ) : (
            <DataGrid
              rows={sponsors}
              columns={columns}
              columnHeaderHeight={50}
              rowHeight={40}
              disableRowSelectionOnClick
              slots={{ toolbar: QuickSearchToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              onRowClick={(row) => {
                const actualRow = row.row;
                navigate('./add', { state: { actualRow } });
              }}
              sx={DataGridStyles}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSponsorsDisplay;

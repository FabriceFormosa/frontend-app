import React, { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import DeviceForm from '../components/DeviceForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <Container
  sx={{
    mt: 8,
    backgroundColor: '#e3f2fd',
    border: '2px solid  #90caf9',
    padding: 2
  }}
>
      {/* Première ligne : email + logout alignés horizontalement */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                {/* Logo en haut à gauche */}
                <img
                  src="https://prd1-ticatag-rootorganizations-assets.s3.amazonaws.com/Logos/1735210042829-CfgKAPA"
                  alt="app-logo"
                  style={{ width: '224px', height: '53px' }}
                />
              </Box>
        <Typography variant="h6">
          {user?.email || 'Utilisateur inconnu'}
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Deuxième ligne : formulaire + tableau */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          
          gap: 2,
        }}
      >
  {/* Formulaire : 1/3 */}
<Box
  sx={{
    width: { xs: '100%', md: '40%' },
    flex: { xs: 'none', md: '0 0 40%' }, // facultatif, renforce le comportement
    
  }}
>
  <DeviceForm
    selectedDevice={selectedDevice}
    onClear={() => setSelectedDevice(null)}
    onRefresh={handleRefresh}
  />
</Box>

   {/* Table : 2/3 */}
<Box
  sx={{
    width: { xs: '100%', md: '60%' },
    flex: { xs: 'none', md: '0 0 60%' },
    
  }}
>
  <Table 
    key={refreshFlag}
    onRowSelect={setSelectedDevice}
  />
</Box>
      </Box>
    </Container>
  );
}

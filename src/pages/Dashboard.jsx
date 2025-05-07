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
    mt: 2,
    mb: 4,
    
    backgroundColor: '#e3f2fd',
    border: '2px solid  #90caf9',
    padding: 2
  }}
>
      {/* Première ligne : email + logout alignés horizontalement */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
                {/* Logo en haut à gauche */}
                <img
                  src="https://prd1-ticatag-rootorganizations-assets.s3.amazonaws.com/Logos/1735210042829-CfgKAPA"
                  alt="app-logo"
                  style={{ width: '224px', height: '53px' }}
                />
              </Box>
              <Box 
  sx={{ 
    
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: 0,
    px: 0 
  }}
>
  <Box>
  <Button 
      variant="contained" 
       
      onClick={handleLogout} 
      sx={{ mt: 0 }} // marge au-dessus du bouton
    >
      Logout
    </Button>
    <Typography variant="h6">
      {user?.email || 'Utilisateur inconnu'}
    </Typography>

  </Box>
</Box>

   
      </Box>

      {/* Deuxième ligne : formulaire + tableau */}
      <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2,
  }}
>
  {/* Formulaire : prend 1/3 de l'espace */}
  <Box sx={{ flex: 1 }}>
    <DeviceForm
      selectedDevice={selectedDevice}
      onClear={() => setSelectedDevice(null)}
      onRefresh={handleRefresh}
    />
  </Box>

  {/* Table : prend 2/3 de l'espace */}
  <Box sx={{ flex: 1 }}>
    <Table 
      key={refreshFlag}
      onRowSelect={setSelectedDevice}
    />
  </Box>
</Box>

    </Container>
  );
}

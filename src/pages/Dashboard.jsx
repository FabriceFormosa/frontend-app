import React, { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import DeviceForm from '../components/DeviceForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState(null); // Device sélectionné

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        {/* Formulaire aligné à gauche */}
        <DeviceForm
          selectedDevice={selectedDevice}
          onClear={() => setSelectedDevice(null)}
          onRefresh={() => {}}
        />
        
        {/* Section de l'email et du bouton logout */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="h6">
            {user?.email ? user.email : 'Utilisateur inconnu'}
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Tableau pour afficher les devices aligné sous le formulaire */}
      <Box sx={{ mt: 4 }}>
        <Table onRowSelect={setSelectedDevice} />
      </Box>
    </Container>
  );
}

import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import DeviceForm from '../components/DeviceForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState(null); // ← device sélectionné

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container sx={{ mt: 8, position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        {user?.email ? `${user.email}` : ''}
        {user?.createdAt && ` Created: ${new Date(user.createdAt * 1000).toLocaleDateString()}`}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>

      <DeviceForm
        selectedDevice={selectedDevice}
        onClear={() => setSelectedDevice(null)}
      />
      <Table onRowSelect={setSelectedDevice} />
    </Container>
  );
}

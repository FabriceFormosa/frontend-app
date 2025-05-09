import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import { TextField, Button, Box, Paper, Typography, Snackbar, Alert as MuiAlert } from '@mui/material';
import MapView from './MapView';

const isMacAddressValid = (value) => {
  const macAddressPattern = /^([0-9A-Fa-f]{12}|([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2})$/;
  return macAddressPattern.test(value);
};

const isLongitudeValid = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= -180 && num <= 180;
};

const isLatitudeValid = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= -90 && num <= 90;
};

const DeviceForm = ({ selectedDevice, onClear, onRefresh }) => {
  const [formData, setFormData] = useState({
    adress: '',
    latitude: '',
    longitude: '',
    addresspostale: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' or 'error'
  });

  useEffect(() => {
    if (selectedDevice) {
      setFormData({
        adress: selectedDevice.adress || '',
        latitude: selectedDevice.latitude || '',
        longitude: selectedDevice.longitude || '',
        addresspostale: selectedDevice.addresspostale || ''
      });
    } else {
      setFormData({ adress: '', latitude: '', longitude: '', addresspostale: '' });
    }
  }, [selectedDevice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification du format de latitude et longitude
    if (!isLatitudeValid(formData.latitude) || !isLongitudeValid(formData.longitude)) {
      setSnackbar({
        open: true,
        message: 'Coordonnées invalides. Vérifiez la latitude et la longitude.',
        severity: 'error'
      });
      return;
    }

    if (!isMacAddressValid(formData.adress)) {
      setSnackbar({
        open: true,
        message: 'Format : 00:37:6C:E2:EB:62 ou 00376CE2EB62',
        severity: 'error'
      });
      return; 
    }

    const formatMacToCompact = (mac) => {
      return mac.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    };

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const data = {
      adress: formatMacToCompact(formData.adress),
      latitude: formData.latitude,
      longitude: formData.longitude,
      addresspostale: formData.addresspostale,
    };

    try {
      if (selectedDevice?.id) {
        await axios.put(
          `http://localhost:8080/api/devices/${selectedDevice.id}`,
          data,
          config
        );
        setSnackbar({ open: true, message: 'Device mis à jour avec succès !', severity: 'success' });
      } else {
        await axios.post('http://localhost:8080/api/devices', data, config);
        setSnackbar({ open: true, message: 'Device ajouté avec succès !', severity: 'success' });
      }

      setFormData({ adress: '', latitude: '', longitude: '', addresspostale: '' });
      onClear?.();
      onRefresh?.();
    } catch (error) {
      setSnackbar({ open: true, message: error.response.data.error, severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedDevice?.id) return;
    if (!window.confirm('Confirmer la suppression de ce device ?')) return;

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      await axios.delete(
        `http://localhost:8080/api/devices/${selectedDevice.id}`,
        config
      );
      setSnackbar({ open: true, message: 'Device supprimé avec succès', severity: 'success' });
      setFormData({ adress: '', latitude: '', longitude: '', addresspostale: '' });
      onClear?.();
      onRefresh?.();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la suppression.', severity: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4, height: '100%', display: 'flex', flexDirection: 'column', border: '2px solid #90caf9' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {/* Formulaire à gauche */}
        <Box sx={{ width: '50%', pr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }} component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            {selectedDevice ? 'Modifier un Device' : 'Ajouter un Device'}
          </Typography>
  
          <TextField
            label="Mac Address"
            name="adress"
            value={formData.adress}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!isMacAddressValid(formData.adress)}
            helperText={!isMacAddressValid(formData.adress) ? 'Format : 00:37:6C:E2:EB:62 ou 00376CE2EB62' : ''}
          />
  
          <TextField
            label="Latitude"
            name="latitude"
            type="number"
            value={formData.latitude}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!isLatitudeValid(formData.latitude)}
            helperText={!isLatitudeValid(formData.latitude) ? 'La latitude doit être comprise entre -90 et 90' : ''}
          />
  
          <TextField
            label="Longitude"
            name="longitude"
            type="number"
            value={formData.longitude}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!isLongitudeValid(formData.longitude)}
            helperText={!isLongitudeValid(formData.longitude) ? 'La longitude doit être entre -180 et 180' : ''}
          />
  
          <Tooltip
            title={formData.addresspostale}
            placement="top"
            componentsProps={{ tooltip: { sx: { fontSize: '16px', maxWidth: 300 } } }}
          >
            <TextField
              label="Adresse Postale"
              name="addresspostale"
              value={formData.addresspostale}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Tooltip>
        </Box>
  
        {/* Carte à droite */}
        <Box sx={{ width: '50%', pl: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isLatitudeValid(formData.latitude) && isLongitudeValid(formData.longitude) && (
            <Box sx={{ width: '100%', height: 400 }}>
              <MapView latitude={parseFloat(formData.latitude)} longitude={parseFloat(formData.longitude)} />
            </Box>
          )}
        </Box>
      </Box>
  
      {/* Boutons sous les deux colonnes */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
          {selectedDevice ? 'Mettre à jour' : 'Ajouter'}
        </Button>
        {selectedDevice && (
          <>
            <Button variant="outlined" color="secondary" onClick={onClear}>
              Annuler
            </Button>
            <Button variant="outlined" sx={{ background: 'rgb(198, 40, 40)', color: '#fff' }} onClick={handleDelete}>
              Supprimer
            </Button>
          </>
        )}
      </Box>
  
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default DeviceForm;

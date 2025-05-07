import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';



const isMacAddressValid = (value) => {
  const macAddressPattern = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/;
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
    longitude: ''
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
        longitude: selectedDevice.longitude || ''
      });
    } else {
      setFormData({ adress: '', latitude: '', longitude: '' });
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
        message: 'Adresse MAC invalide. Exemple : 00:37:6C:E2:EB:62',
        severity: 'error'
      });
      return; // <-- Ajout de cette parenthèse fermante
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const data = {
      adress: formData.adress,
      latitude: formData.latitude,
      longitude: formData.longitude
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

      setFormData({ adress: '', latitude: '', longitude: '' });
      onClear?.();
      onRefresh?.();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la soumission du formulaire.', severity: 'error' });
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
      setFormData({ adress: '', latitude: '', longitude: '' });
      onClear?.();
      onRefresh?.();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la suppression.', severity: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
 

      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        {selectedDevice ? 'Modifier un Device' : 'Ajouter un Device'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          label="Adresse"
          name="adress"
          value={formData.adress}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={!isMacAddressValid(formData.adress)}
  helperText={
    !isMacAddressValid(formData.adress)
      ? 'Adresse MAC invalide. Exemple : 00:37:6C:E2:EB:62'
      : ''
  }
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
          helperText={
            !isLatitudeValid(formData.latitude)
              ? 'La latitude doit être comprise entre -90 et 90'
              : ''
          }
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
          helperText={
            !isLongitudeValid(formData.longitude)
              ? 'La longitude doit être entre -180 et 180'
              : ''
          }
        />

        {/* Alignement des boutons à droite */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="contained" color="primary" type="submit">
            {selectedDevice ? 'Mettre à jour' : 'Ajouter'}
          </Button>
          {selectedDevice && (
            <>
              <Button variant="outlined" color="secondary" onClick={onClear} sx={{ ml: 2 }}>
                Annuler
              </Button>
              <Button
                variant="outlined"
                sx={{ background: "rgb(198, 40, 40)", ml: 2 }}
                onClick={handleDelete}
              >
                Supprimer
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Snackbar pour le message */}
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

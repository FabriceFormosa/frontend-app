import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography
} from '@mui/material';

const DeviceForm = ({ selectedDevice, onClear, onRefresh }) => {
  const [formData, setFormData] = useState({
    adress: '',
    latitude: '',
    longitude: ''
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
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const data = {
      adress: formData.adress,
      latitude: (formData.latitude),
      longitude:(formData.longitude)
    };

    try {
      if (selectedDevice?.id) {
        await axios.put(
          `http://localhost:8080/api/devices/${selectedDevice.id}`,
          data,
          config
        );
        alert('Device mis à jour avec succès !');
      } else {
        await axios.post('http://localhost:8080/api/devices', data, config);
        alert('Device ajouté avec succès !');
      }

      setFormData({ adress: '', latitude: '', longitude: '' });
      onClear?.();
      onRefresh?.(); // ← rechargement des données
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la soumission du formulaire.');
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
      alert('Device supprimé avec succès');
      setFormData({ adress: '', latitude: '', longitude: '' });
      onClear?.();
      onRefresh?.(); // ← rechargement des données
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {selectedDevice ? 'Modifier un Device' : 'Ajouter un Device'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Adress"
          name="adress"
          value={formData.adress}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
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
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            {selectedDevice ? 'Mettre à jour' : 'Ajouter'}
          </Button>
          {selectedDevice && (
            <>
              <Button variant="outlined" color="secondary" onClick={onClear}>
                Annuler
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Supprimer
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DeviceForm;

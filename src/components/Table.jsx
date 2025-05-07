import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Table({ onRowSelect }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const columns = [
    { field: 'adress', headerName: 'Mac Address', flex: 1 },
    { field: 'latitude', headerName: 'Latitude', flex: 1 },
    { field: 'longitude', headerName: 'Longitude', flex: 1 },
    { field: 'addresspostale', headerName: 'Adress', flex: 1 },
  ];

  const fetchDevices = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const url = query
        ? `http://localhost:8080/api/devices/search?q=${encodeURIComponent(query)}`
        : `http://localhost:8080/api/devices`;

        console.log('url:',url)

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.devices || [];
      const withIds = data.map((item, index) => ({
        id: item.id || index + 1,
        ...item,
      }));

      setDevices(withIds);
    } catch (err) {
      console.error(err);
      setError('Erreur de récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchDevices(value);
  };

  // Initial fetch → 25 dernières entrées
  useEffect(() => {
    fetchDevices('');
  }, []);

  return (
    <Paper sx={{ height: '100%', width: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
      <TextField
        label="Recherche MAC Address"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2, color: 'red' }}>{error}</Box>
      ) : (
        <DataGrid
        rows={devices}
        columns={columns}
        pageSizeOptions={[5, 10]}
        onRowClick={(params) => onRowSelect(params.row)} // ← callback au parent
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        sx={{ border: 0 }}
      />
      )}
    </Paper>
  );
}

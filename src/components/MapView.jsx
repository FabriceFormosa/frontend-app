import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const flagIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapUpdater = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);

  return null;
};

const MapView = ({ latitude, longitude }) => {
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  useEffect(() => {
    if (!isNaN(lat) && !isNaN(lng)) {
      const fetchCountry = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const name = data.address?.country || '';
          const code = data.address?.country_code?.toUpperCase() || '';
          setCountryName(name);
          setCountryCode(code);
        } catch (err) {
          console.error('Erreur lors du géocodage inversé', err);
          setCountryName('');
          setCountryCode('');
        }
      };

      fetchCountry();
    }
  }, [lat, lng]);

  if (!latitude || !longitude || isNaN(lat) || isNaN(lng)) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: 400 }}>
      {/* Drapeau en haut à droite */}
      {countryCode && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'white',
            padding: '6px 8px',
            borderRadius: 6,
            boxShadow: '0 0 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <img
            src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
            alt={`Drapeau de ${countryName}`}
            style={{ display: 'block', marginBottom: 4 }}
          />
          <span style={{ fontSize: 12 }}>{countryName}</span>
        </div>
      )}

      {/* Carte */}
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={flagIcon}>
          <Popup>Position indiquée</Popup>
        </Marker>
        <MapUpdater latitude={lat} longitude={lng} />
      </MapContainer>
    </div>
  );
};

export default MapView;

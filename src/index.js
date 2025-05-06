import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Assurez-vous d'importer BrowserRouter
import { AuthProvider } from './contexts/AuthContext';  // Import du AuthProvider
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>  {/* Encapsule l'application avec BrowserRouter */}
    <AuthProvider>
    <App />
  </AuthProvider>
  </BrowserRouter>
);

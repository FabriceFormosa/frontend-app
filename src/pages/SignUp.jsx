import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
//import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios'; // Utilisé pour envoyer les données à ton API


export default function SignUp() {
 // const { login } = useContext(AuthContext); // simulate login after register
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) =>  {
    e.preventDefault();
    // register + login mock
    // login(email, password);
    // navigate('/dashboard');

           try {
                const response = await axios.post('http://localhost:8080/register', {
                  username,
                    email,
                    password,
                });
                // ✅ Redirection vers /login après succès
                navigate('/login');
              } catch (err) {
                //setError('Une erreur est survenue lors de l\'inscription.');
                console.error(err);
            }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" align="center">Sign Up</Typography>
        <form onSubmit={handleSubmit}>
        <TextField margin="normal" required fullWidth label="Name" value={username} onChange={(e) => setUserName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">Already have an account? Sign in</Link>
        </Box>
      </Box>
    </Container>
  );
}

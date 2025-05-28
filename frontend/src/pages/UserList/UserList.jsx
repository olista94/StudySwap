import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('studyswap_token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await fetch('http://localhost:3001/api/users/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users.');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Lista de Usuarios
      </Typography>
      {users.length === 0 ? (
        <Alert severity="info">No hay usuarios registrados.</Alert>
      ) : (
        <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 2 }}>
          <List>
            {users.map((user, index) => (
              <React.Fragment key={user._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {user.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Email: {user.email} | Universidad: {user.university || 'N/A'} | Rol: {user.role || 'user'}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < users.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
}
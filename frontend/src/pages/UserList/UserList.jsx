import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const storedUser = localStorage.getItem('studyswap_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('studyswap_token');
      const response = await fetch('http://localhost:3000/api/users/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('studyswap_token');
      const response = await fetch(`http://localhost:3000/api/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar usuario');
      }
      setUserToDelete(null);
      fetchUsers(); // Refrescar lista
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

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
            {users
              .filter(user => currentUser && user._id !== currentUser._id)
              .map((user, index) => (
                <React.Fragment key={user._id}>
                  <ListItem
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                          <IconButton color="primary" onClick={() => navigate(`/admin/users/${user._id}/edit`)}>
                          <EditIcon />
                        </IconButton>
                        {user.role !== 'admin' && (
                          <IconButton color="error" onClick={() => setUserToDelete(user)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={<Typography variant="h6">{user.name}</Typography>}
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

      {/* Modal de confirmación */}
      <Dialog open={!!userToDelete} onClose={() => setUserToDelete(null)}>
        <DialogTitle>¿Eliminar usuario?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.name}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToDelete(null)} disabled={deleting}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

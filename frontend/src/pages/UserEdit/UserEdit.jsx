import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Box,
  Stack
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_USERS } from "../../config/apiConfig";

const API_URL = import.meta.env.VITE_API_URL;

const roles = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" }
];

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("studyswap_token");
        const response = await fetch(`${API_USERS}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar usuario");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user.name || !user.email) {
      setError("Nombre y email son obligatorios.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("studyswap_token");
      const response = await fetch(`${API_USERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar cambios");
      }

      navigate("/admin/manage-users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Usuario no encontrado"}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Editar Usuario
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        <TextField
          label="Nombre"
          name="name"
          value={user.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          select
          label="Rol"
          name="role"
          value={user.role}
          onChange={handleChange}
          fullWidth
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/admin/manage-users")}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

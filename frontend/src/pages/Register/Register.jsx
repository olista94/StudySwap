import { useState } from "react";
import { registerUser } from "../../services/authService";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Paper,
} from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#FCFFFC", p: 2 }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 450 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Crear cuenta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ ¡Registro exitoso! Ya puedes iniciar sesión.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Universidad"
            name="university"
            value={form.university}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#248232", ":hover": { backgroundColor: "#2BA84A" } }}
          >
            Registrarse
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

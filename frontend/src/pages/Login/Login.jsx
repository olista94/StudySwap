import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../services/authService";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Paper,
} from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/explorer";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const user = localStorage.getItem("studyswap_user");
    if (user) navigate(from);
    else setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(form);
      localStorage.setItem("studyswap_token", token);
      localStorage.setItem("studyswap_user", JSON.stringify(user));
      navigate(from);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return null;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // ajusta altura excluyendo AppBar
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Iniciar sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
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
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

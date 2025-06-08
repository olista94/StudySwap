import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const contactEmail = location.state?.contactEmail || null;

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

      if (contactEmail) {
        window.location.href = `mailto:${contactEmail}`;

        setTimeout(() => navigate(from), 500); // `setTimeout` para esperar antes de navegar:
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return null;

  return (
    <Box
      sx={{
        minHeight: "70vh",
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
          <Typography variant="body2" sx={{ mt: 2 }}>
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#2BA84A", fontWeight: 500 }}
            >
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

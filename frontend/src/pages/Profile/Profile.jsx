import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword } from "../../services/userService";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Divider,
  Stack
} from "@mui/material";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", university: "", email: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("studyswap_user");
    if (!stored) return navigate("/login");

    const user = JSON.parse(stored);
    setUser(user);
    setForm({ name: user.name, university: user.university, email: user.email });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("studyswap_token");
      const updated = await updateProfile(form, token);
      localStorage.setItem("studyswap_user", JSON.stringify(updated));
      setUser(updated);
      setMessage("✅ Perfil actualizado correctamente");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const changePasswordHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("studyswap_token");
      await changePassword(passForm, token);
      setMessage("🔐 Contraseña cambiada correctamente");
      setPassForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  if (!user) return null;

  return (
    <Box className="profile-container" sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3 }}>

      {message && (
        <Alert
          severity={message.startsWith("✅") || message.startsWith("🔐") ? "success" : "error"}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Box component="form" onSubmit={saveProfile}>
        <Typography variant="h6" gutterBottom>Editar datos</Typography>
        <Stack spacing={2}>
          <TextField
            name="name"
            label="Nombre"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="university"
            label="Universidad"
            value={form.university}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" color="success">
            Guardar cambios
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box component="form" onSubmit={changePasswordHandler}>
        <Typography variant="h6" gutterBottom>Cambiar contraseña</Typography>
        <Stack spacing={2}>
          <TextField
            name="currentPassword"
            label="Contraseña actual"
            type="password"
            required
            value={passForm.currentPassword}
            onChange={handlePassChange}
            fullWidth
          />
          <TextField
            name="newPassword"
            label="Nueva contraseña"
            type="password"
            required
            value={passForm.newPassword}
            onChange={handlePassChange}
            fullWidth
          />
          <Button type="submit" variant="outlined" color="primary">
            Cambiar contraseña
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

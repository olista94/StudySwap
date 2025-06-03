import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword, uploadProfileImage } from "../../services/userService";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Divider,
  Stack,
  Avatar
} from "@mui/material";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", university: "", email: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      setMessage("❌ Por favor, selecciona una imagen para subir.");
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedImage); // 'profileImage' debe coincidir con el nombre de campo en el backend

    try {
      const token = localStorage.getItem("studyswap_token");
      // Asume que uploadProfileImage es una nueva función en tu userService
      const updatedUser = await uploadProfileImage(formData, token);
      localStorage.setItem("studyswap_user", JSON.stringify(updatedUser));
      setUser(updatedUser); // Actualiza el estado del usuario con la nueva URL de la imagen
      setSelectedImage(null); // Limpia la imagen seleccionada
      setMessage("✅ Imagen de perfil actualizada correctamente");
    } catch (err) {
      setMessage("❌ Error al subir la imagen: " + err.message);
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

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          alt={user.name}
          src={user.profileImage || "https://res.cloudinary.com/studyswap/image/upload/v1/avatars/default-avatar.png"}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <Typography variant="h6" gutterBottom>Imagen de Perfil</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" component="label">
            Seleccionar imagen
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
            />
          </Button>
          {selectedImage && (
            <Typography variant="body2" sx={{ ml: 1 }}>
              {selectedImage.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={uploadImage}
            disabled={!selectedImage} // Deshabilita el botón si no hay imagen seleccionada
          >
            Subir imagen
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 4 }} /> {/* Separador para la sección de imagen */}

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

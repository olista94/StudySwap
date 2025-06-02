import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
  Alert,
  Stack,
  InputLabel,
  FormControl
} from "@mui/material";
import "./PublishTutorOffer.css";

export default function PublishTutorOffer() {
  const [form, setForm] = useState({
    educationLevels: [],
    subject: "",
    description: "",
    price: "",
    modality: "online",
    availability: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("studyswap_token");

    try {
      const res = await fetch("http://localhost:3000/api/tutors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al publicar oferta");

      setMessage("✅ Oferta publicada");
      setTimeout(() => navigate("/tutors"), 1500);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <Box className="publish-container" sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h5" gutterBottom>🎯 Publicar clases particulares</Typography>

      {message && (
        <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            name="subject"
            label="Asignatura"
            required
            fullWidth
            value={form.subject}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel id="education-label">Tipo de estudios</InputLabel>
            <Select
              labelId="education-label"
              name="educationLevels"
              multiple
              value={form.educationLevels}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, educationLevels: e.target.value }))
              }
              renderValue={(selected) => selected.join(", ")}
            >
              {[
                "ESO",
                "Bachillerato",
                "FP",
                "Universidad",
                "Oposiciones",
                "Postgrado",
                "EBAU",
                "Idiomas",
              ].map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="description"
            label="Descripción"
            multiline
            rows={3}
            fullWidth
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            name="price"
            label="Precio por hora (€)"
            type="number"
            required
            fullWidth
            value={form.price}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel id="modality-label">Modalidad</InputLabel>
            <Select
              labelId="modality-label"
              name="modality"
              value={form.modality}
              label="Modalidad"
              onChange={handleChange}
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="presencial">Presencial</MenuItem>
              <MenuItem value="ambas">Ambas</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="availability"
            label="Disponibilidad"
            fullWidth
            value={form.availability}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="success" fullWidth>
            Publicar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

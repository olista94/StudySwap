import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputLabel,
} from "@mui/material";
import "./Upload.css";

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    professor: "",
    university: "",
    year: "",
    file: null
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("studyswap_token");

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));

    try {
      const res = await fetch("http://localhost:3000/api/resources", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (!res.ok) throw new Error("Error al subir el recurso");

      setMessage("✅ Recurso subido correctamente");
      setForm({
        title: "",
        description: "",
        subject: "",
        professor: "",
        university: "",
        year: "",
        file: null
      });
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>📤 Subir apunte</Typography>

      {message && (
        <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Título"
            required
            value={form.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="description"
            label="Descripción"
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="subject"
            label="Asignatura"
            required
            value={form.subject}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="professor"
            label="Profesor"
            value={form.professor}
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
            name="year"
            label="Año"
            type="number"
            value={form.year}
            onChange={handleChange}
            fullWidth
          />
          <Box>
            <InputLabel>Archivo (PDF o imagen)</InputLabel>
            <input
              name="file"
              type="file"
              accept=".pdf,.md,.jpg,.png,.jpeg"
              required
              onChange={handleChange}
              style={{ marginTop: "8px" }}
            />
          </Box>
          <Button type="submit" variant="contained" color="success" fullWidth>
            Subir recurso
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

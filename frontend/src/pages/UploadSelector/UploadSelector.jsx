import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Stack,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from "@mui/material";

export default function UploadSelector() {
  const [value, setValue] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    subject: "",
    professor: "",
    center: "",
    year: "",
    file: null
  });
  const [offerForm, setOfferForm] = useState({
    educationLevels: [],
    subject: "",
    description: "",
    price: "",
    modality: "Online",
    location: ""
  });
  const [uploadMessage, setUploadMessage] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  const handleChangeTab = (event, newValue) => setValue(newValue);

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOfferForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("studyswap_token");

    const data = new FormData();
    Object.keys(uploadForm).forEach(key => data.append(key, uploadForm[key]));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (!res.ok) throw new Error("Error al subir el recurso");

      setUploadMessage("✅ Recurso subido correctamente");
      setUploadForm({
        title: "",
        description: "",
        subject: "",
        professor: "",
        center: "",
        year: "",
        file: null
      });
    } catch (err) {
      setUploadMessage("❌ " + err.message);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("studyswap_token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tutors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(offerForm),
      });

      if (!res.ok) throw new Error("Error al publicar oferta");

      setOfferMessage("✅ Oferta publicada");
      setOfferForm({
        educationLevels: [],
        subject: "",
        description: "",
        price: "",
        modality: "Online",
        location: ""
      });
    } catch (err) {
      setOfferMessage("❌ " + err.message);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, width: "100%" }}>
          <Typography variant="h5" gutterBottom align="center">
            ¿Qué te gustaría compartir hoy?
          </Typography>
          <Tabs
            value={value}
            onChange={handleChangeTab}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            centered
            sx={{ mt: 2 }}
          >
            <Tab label="Colgar temario" />
            <Tab label="Publicar clases particulares" />
          </Tabs>
        </Paper>
      </Box>

      <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
        {value === 0 && (
          <Box component="form" onSubmit={handleUploadSubmit} encType="multipart/form-data">
            <Typography variant="h6" gutterBottom>📤 Colgar temario</Typography>
            {uploadMessage && (
              <Alert severity={uploadMessage.startsWith("✅") ? "success" : "error"} sx={{ mb: 2 }}>
                {uploadMessage}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField name="title" label="Título" required fullWidth value={uploadForm.title} onChange={handleUploadChange} />
              <TextField name="description" label="Descripción" multiline rows={3} fullWidth value={uploadForm.description} onChange={handleUploadChange} />
              <TextField name="subject" label="Asignatura" required fullWidth value={uploadForm.subject} onChange={handleUploadChange} />
              <TextField name="professor" label="Profesor" fullWidth value={uploadForm.professor} onChange={handleUploadChange} />
              <TextField name="center" label="Centro" fullWidth value={uploadForm.center} onChange={handleUploadChange} />
              <TextField name="year" label="Año" type="number" fullWidth value={uploadForm.year} onChange={handleUploadChange} />
              <Box>
                <InputLabel>Archivo (PDF o imagen)</InputLabel>
                <input
                  name="file"
                  type="file"
                  accept=".pdf,.md,.jpg,.png,.jpeg"
                  required
                  onChange={handleUploadChange}
                  style={{ marginTop: "8px" }}
                />
              </Box>
              <Button type="submit" variant="contained" color="success" fullWidth>
                Subir recurso
              </Button>
            </Stack>
          </Box>
        )}

        {value === 1 && (
          <Box component="form" onSubmit={handleOfferSubmit}>
            <Typography variant="h6" gutterBottom>🎯 Publicar clases particulares</Typography>
            {offerMessage && (
              <Alert severity={offerMessage.startsWith("✅") ? "success" : "error"} sx={{ mb: 2 }}>
                {offerMessage}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField name="subject" label="Asignatura" required fullWidth value={offerForm.subject} onChange={handleOfferChange} />
              <FormControl fullWidth>
                <InputLabel id="education-label">Tipo de estudios</InputLabel>
                <Select
                  labelId="education-label"
                  name="educationLevels"
                  multiple
                  value={offerForm.educationLevels}
                  onChange={(e) => setOfferForm((prev) => ({ ...prev, educationLevels: e.target.value }))}
                  input={<OutlinedInput label="Tipo de estudios" />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {["ESO", "Bachillerato", "FP", "Universidad", "Oposiciones", "Postgrado", "EBAU", "Idiomas"].map((level) => (
                    <MenuItem key={level} value={level}>
                      <Checkbox checked={offerForm.educationLevels.includes(level)} />
                      <ListItemText primary={level} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField name="description" label="Descripción" multiline rows={3} fullWidth value={offerForm.description} onChange={handleOfferChange} />
              <TextField name="price" label="Precio por hora (€)" type="number" required fullWidth value={offerForm.price} onChange={handleOfferChange} />
              <FormControl fullWidth>
                <InputLabel id="modality-label">Modalidad</InputLabel>
                <Select
                  labelId="modality-label"
                  name="modality"
                  value={offerForm.modality}
                  label="Modalidad"
                  onChange={handleOfferChange}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Ambas">Ambas</MenuItem>
                </Select>
              </FormControl>
              <TextField name="location" label="Ciudad" fullWidth value={offerForm.location} onChange={handleOfferChange} />
              <Button type="submit" variant="contained" color="success" fullWidth>
                Publicar
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

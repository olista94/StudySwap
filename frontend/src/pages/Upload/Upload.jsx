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
import { API_RESOURCES } from "../../config/apiConfig";

const API_URL = import.meta.env.VITE_API_URL;

const centrosEducativos = [
  "Universidad de Alcalá", "Universidad de Alicante", "Universidad de Almería", "Universidad de Cádiz",
  "Universidad de Castilla-La Mancha", "Universidad de Córdoba", "Universidad de Extremadura", "Universidad de Girona",
  "Universidad de Granada", "Universidad de Huelva", "Universidad de Jaén", "Universidad de La Coruña",
  "Universidad de La Laguna", "Universidad de Las Palmas de Gran Canaria", "Universidad de León", "Universidad de Lleida",
  "Universidad de Málaga", "Universidad de Murcia", "Universidad de Oviedo", "Universidad de Salamanca",
  "Universidad de Santiago de Compostela", "Universidad de Sevilla", "Universidad de Valencia", "Universidad de Valladolid",
  "Universidad de Vigo", "Universidad de Zaragoza", "Universidad Autónoma de Barcelona", "Universidad Autónoma de Madrid",
  "Universidad Carlos III de Madrid", "Universidad Complutense de Madrid", "Universidad Politécnica de Cataluña",
  "Universidad Politécnica de Madrid", "Universidad Politécnica de Valencia", "Universidad Pompeu Fabra",
  "Universidad Pública de Navarra", "Universidad Rey Juan Carlos", "Universidad Rovira i Virgili",
  "Universidad Miguel Hernández de Elche", "Universidad Nacional de Educación a Distancia",
  "Universidad Internacional de Andalucía", "Universidad Internacional Menéndez Pelayo", "Universidad Pablo de Olavide",
  "Universidad Politécnica de Cartagena", "Universidad del País Vasco", "Universidad de Burgos",
  "Universidad de La Rioja", "Universidad Internacional Isabel I de Castilla", "Universitat Oberta de Catalunya",
  "Universidad Católica de Ávila", "Universidad Católica San Antonio de Murcia", "Universidad Cardenal Herrera-CEU",
  "Universidad CEU San Pablo", "Universidad CEU Abat Oliba", "Universidad Francisco de Vitoria",
  "Universidad Pontificia Comillas", "Universidad Pontificia de Salamanca", "Universidad Internacional de Cataluña",
  "Universidad Europea de Madrid", "Universidad Europea de Valencia", "Universidad Europea Miguel de Cervantes",
  "Universidad Loyola Andalucía", "Universidad Nebrija", "Universidad Alfonso X el Sabio",
  "Universidad Internacional de La Rioja", "Universidad Internacional de Valencia", "Universidad Internacional de Madrid (UDIMA)",
  "Universidad de Deusto", "Universidad Ramon Llull", "Universidad San Jorge", "Universidad Villanueva",
  "Universidad Mondragón", "Universidad EUNEIZ", "Universidad ESIC", "Universidad Cunef",
  "Universidad UAX Rafa Nadal School of Sport", "Universidad Europea del Atlántico",
  "Universidad Internacional de Ciencias Sociales y Económicas", "Universidad EUNSA",
  "Universidad Atlántico-Mediterránea", "Universidad UNICAN", "Universidad UDIT",
  "Universidad de las Hespérides", "Universidad Intercontinental de la Empresa",
  "Universidad TEC", "Universidad Internacional de Europa", "Universidad de Diseño, Innovación y Tecnología",
  "Universidad Odisea", "Universidad FUE-UJI", "IES Ramiro de Maeztu",
  "IES Lluís Vives",
  "IES Juan de la Cierva",
  "IES Santa Engracia",
  "IES Padre Manjón",
  "IES Ramón y Cajal",
  "IES Parque Goya",
  "IES Blas Infante",
  "IES Arzobispo Xelmírez I",
  "IES Monte das Moas",
  "IES Miguel Hernández",
  "IES La Bisbal",
  "IES Gregorio Prieto",
  "IES La Zafra",
  "IES Pablo Picasso",
  "IES Vega del Guadalquivir",
  "IES Zurbarán",
  "IES Doctor Balmis",
  "IES Gonzalo Torrente Ballester",
  "IES Virgen de la Paloma",
  "IES Santa Catalina",
  "IES Sabina Mora",
  "IES Doctor Fleming",
  "IES El Garbí",
  "IES La Campiña",
  "IES Gabriel y Galán",
  "IES Miguel de Cervantes",
  "IES Colegio de Santa María",
  "IES Reyes Católicos",
  "IES Goya",
  "IES Ángel Corella",
  "IES La Cañada",
  "IES Puerta de la Serna",
  "IES Reino Aftasí",
  "IES José Marín",
  "IES Martín García Ramos",
  "IES Comarcal de Monforte",
  "IES Ribera de Castilla",
  "IES Santiago Apóstol",
  "IES Ángel Nieto",
  "IES Lluís Simarro",
  "IES Saavedra Fajardo",
  "IES La Flota",
  "IES Miralbueno",
  "IES María Zambrano",
  "IES Galileo Galilei",
  "IES Juan de Juni",
  "IES Virgen del Castillo",
  "IES La Arboleda",
  "IES Santo Domingo",
  "IES San Isidro",
  "IES Príncipe Felipe",
  "IES Portada Alta",
  "IES Fray Luis de León",
  "IES Lluís Vives",
  "IES Ángel Nieto",
  "IES Valle de Aller",
  "IES Eduardo Blanco Amor",
  "IES Alfonso X El Sabio",
  "IES María de Molina",
  "IES Alzina",
  "IES Antonio Machado",
  "IES As Lagoas",
  "IES Blanco Amor", "CIFP Los Enlaces",
  "CIFP Padre Isla",
  "CIFP La Laboral",
  "CIFP Ramón y Cajal",
  "CIFP Vicente Blasco Ibáñez",
  "CIFP Simón de Colonia",
  "CIFP Julián Besteiro",
  "CIFP Tolosaldea",
  "CIFP Miguel Catalán",
  "CIFP Politécnico de Cartagena",
  "CIFP Pintor José María Cruz Novillo",
  "CIFP Zornotza",
  "CIFP Ciudad del Aprendiz",
  "CIFP La Guindalera",
  "CIFP Virgen de las Nieves",
  "CIFP La Salle",
  "CIFP Júndiz",
  "CIFP Antonio de Nebrija",
  "CIFP Pablo Picasso",
  "CIFP Sierra de las Nieves",
  "CIFP Río Tajo",
  "CIFP de Hostelería y Turismo de Santander",
  "CIFP Ciudad de Béjar",
  "CIFP Arquitecto Peridis",
  "CIFP Benjamín Palencia",
  "CIFP Avilés",
  "CIFP Profesor Juan Bautista de Toledo",
  "CIFP Emilio Ferrari",
  "CIFP Miguel Hernández",
  "CIFP Lope de Vega",
  "CIFP San Blas",
  "CIFP Miquel Martí i Pol",
  "CIFP Pablo Ruiz Picasso",
  "CIFP Cañada Real",
  "CIFP El Espartal",
  "CIFP Plaza de la Cruz",
  "CIFP Jose Luis Sanpedro",
  "CIFP Virgen del Castillo",
  "CIFP Nuestra Señora de las Nieves",
  "CIFP Arquitecto Segura",
  "CIFP Virgen de la Paloma",
  "CIFP Río Guadalentín",
  "CIFP Félix Rodríguez de la Fuente",
  "CIFP Arroyo de la Encomienda",
  "CIFP León Felipe",
  "CIFP Doctor Balmis",
  "CIFP Carmen Martín Gaite",
  "CIFP Virgen de Gracia",
  "CIFP Politécnico de Santiago",
  "CIFP A Xunqueira",
  "CIFP Montecelo",
  "CIFP A Farixa",
  "CIFP As Mercedes",
  "CIFP A Carballeira",
  "Otra"
];

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    professor: "",
    center: "",
    otherCenter: "",
    year: "",
    file: null
  });

  const [message, setMessage] = useState("");
  const [otherCenter, setOtherCenter] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });

    // Si el usuario cambia el centro, vaciamos el campo adicional si no es "Otra"
    if (name === "center" && value !== "Otra") {
      setOtherCenter("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("studyswap_token");

    const data = new FormData();

    // Añadir campos del formulario excepto `otherCenter` (se añade aparte si toca)
    Object.keys(form).forEach((key) => {
      if (key === "otherCenter") return; // 👈 evitar duplicado
      data.append(key, form[key]);
    });

    // Añadir `otherCenter` solo si se ha seleccionado "Otra"
    if (form.center === "Otra" && otherCenter.trim()) {
      data.append("otherCenter", otherCenter.trim());
    }

    try {
      const res = await fetch(`${API_RESOURCES}`, {
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
        center: "",
        otherCenter: "",
        year: "",
        file: null
      });
      setOtherCenter(""); // limpiar campo adicional
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>📤 Subir temario</Typography>

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
            required
            value={form.professor}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            name="center"
            value={form.center}
            required
            onChange={handleChange}
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">Selecciona un centro educativo</option>
            {centrosEducativos.map((uni) => (
              <option key={uni} value={uni}>{uni}</option>
            ))}
          </TextField>

          {/* Campo adicional si elige "Otra" */}
          {form.center === "Otra" && (
            <TextField
              name="otherCenter"
              label="Nombre del centro educativo"
              value={otherCenter}
              onChange={(e) => setOtherCenter(e.target.value)}
              required
              fullWidth
            />
          )}

          <TextField
            name="year"
            label="Año"
            required
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

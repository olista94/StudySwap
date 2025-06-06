import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Container,
  Chip,
  Avatar,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputAdornment
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import "./TutorOffersList.css";
import { API_TUTORS } from "../../config/apiConfig";

const API_URL = import.meta.env.VITE_API_URL;

export default function TutorOffersList() {
  const [offers, setOffers] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    subject: "",
    modality: "",
    price: "",
    name: "",
    availability: "",
    education: []
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("studyswap_user") || "null");

  const token = localStorage.getItem("studyswap_token");

  useEffect(() => {
    fetch(`${API_TUTORS}`)
      .then(res => res.json())
      .then(setOffers)
      .catch(err => console.error("Error al cargar ofertas:", err));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const result = offers.filter((offer) => {
      const combined = [
        offer.subject,
        offer.modality,
        offer.price?.toString(),
        offer.userId?.name,
        offer.availability,
        offer.description,
        offer.educationLevels?.join(" ")
      ].join(" ").toLowerCase();

      return (
        combined.includes(query) &&
        (!filters.subject || offer.subject?.toLowerCase().includes(filters.subject.toLowerCase())) &&
        (!filters.modality || offer.modality?.toLowerCase().includes(filters.modality.toLowerCase())) &&
        (!filters.price || offer.price?.toString().includes(filters.price)) &&
        (!filters.name || offer.userId?.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.availability || offer.availability?.toLowerCase().includes(filters.availability.toLowerCase())) &&
        (filters.education.length === 0 ||
          filters.education.some((filterLevel) =>
            (offer.educationLevels || []).includes(filterLevel)
          ))
      );
    });

    setFilteredOffers(result);
  }, [offers, filters, searchQuery]);

  const handleFilter = (e) => {
    const { name, value } = e.target;

    if (name === "search") {
      setSearchQuery(value);
    } else if (name === "education") {
      setFilters((prev) => ({ ...prev, education: typeof value === 'string' ? value.split(',') : value }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOpen = (img) => {
    setActiveImage(img);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      {!token && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
          sx={{ ml: 3, mt: 4 }}
        >
          ← Volver al inicio
        </Button>
      )}

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🎓 Profesores particulares
        </Typography>

        <Stack spacing={1} mb={2}>
          <TextField
            name="search"
            label="¿Qué clase estás buscando?"
            value={searchQuery}
            onChange={handleFilter}
            fullWidth
            size="medium"
            sx={{ fontSize: "1.2rem" }}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={1}>
          <TextField
            name="subject"
            label="Asignatura"
            value={filters.subject}
            onChange={handleFilter}
            fullWidth
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel id="modality-label">Modalidad</InputLabel>
            <Select
              labelId="modality-label"
              name="modality"
              value={filters.modality}
              label="Modalidad"
              onChange={handleFilter}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="presencial">Presencial</MenuItem>
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="ambas">Ambas</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="education-label">Tipo de estudio</InputLabel>
            <Select
              labelId="education-label"
              multiple
              name="education"
              value={filters.education || []}
              onChange={handleFilter}
              input={<OutlinedInput label="Tipo de estudio" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {["ESO", "Bachillerato", "FP", "Universidad", "Oposiciones", "Postgrado", "EBAU", "Idiomas"].map((level) => (
                <MenuItem key={level} value={level} sx={{ py: 0, minHeight: 'auto' }}>
                  <Checkbox checked={filters.education?.includes(level)} size="small" />
                  <ListItemText primary={level} primaryTypographyProps={{ fontSize: 13 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={3}>
          <TextField
            name="name"
            label="Nombre del profesor"
            value={filters.name}
            onChange={handleFilter}
            fullWidth
            size="small"
          />
          <TextField
            name="availability"
            label="Disponibilidad"
            value={filters.availability}
            onChange={handleFilter}
            fullWidth
            size="small"
          />
          <TextField
            name="price"
            label="Precio"
            value={filters.price}
            onChange={handleFilter}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">€/hora</InputAdornment>,
            }}
          />
        </Stack>

        <Stack spacing={3}>
          {filteredOffers.map((offer) => (
            <Card key={offer._id} className="tutor-card" sx={{ p: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Avatar
                    alt={offer.userId?.name}
                    src={offer.userId?.profileImage || "/default-avatar.png"}
                    sx={{ width: 56, height: 56, cursor: "pointer" }}
                    onClick={() => handleOpen(offer.userId?.profileImage || "/default-avatar.png")}
                  />

                  <Typography variant="h6" gutterBottom>
                    {offer.subject} —{" "}
                    <Typography component="span" color="text.secondary">
                      {offer.userId?.name}
                    </Typography>
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {offer.description}
                </Typography>

                {offer.educationLevels?.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2"><strong>Tipo de estudios:</strong></Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {offer.educationLevels.map((level, index) => (
                        <Chip key={index} label={level} size="small" color="success" />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Typography variant="body2"><strong>Precio:</strong> {offer.price}€/h</Typography>
                <Typography variant="body2"><strong>Modalidad:</strong> {offer.modality}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Disponibilidad:</strong> {offer.availability}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<EmailIcon />}
                  onClick={() => {
                    if (!user) {
                      navigate("/login", {
                        state: {
                          from: location.pathname,
                          contactEmail: offer.userId?.email
                        }
                      });
                    } else {
                      window.open(`mailto:${offer.userId?.email}`, "_blank");
                    }
                  }}
                >
                  Contactar
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              maxWidth: 400,
              width: "90%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Para poder contactar debes loguearte o registrarte
            </Typography>

            <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/login", { state: { from: location.pathname } })}
              >
                Iniciar sesión
              </Button>

              <Typography variant="body2">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "#2BA84A", fontWeight: 500 }}
                >
                  Regístrate
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Modal>

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 1,
              borderRadius: 2,
              outline: "none"
            }}
          >
            <img
              src={activeImage}
              alt="Imagen ampliada"
              style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px" }}
            />
          </Box>
        </Modal>
      </Container>
    </>
  );
}

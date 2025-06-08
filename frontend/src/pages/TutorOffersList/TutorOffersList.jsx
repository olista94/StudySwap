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
  Slider
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
    priceRange: [0, 100], // rango inicial de 0€ a 100€
    name: "",
    location: "",
    education: []
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("studyswap_user") || "null");

  const token = localStorage.getItem("studyswap_token");

  const locations = [
    "Albacete", "Alicante", "Almería", "Ávila", "Badajoz", "Barcelona", "Bilbao",
    "Burgos", "Cáceres", "Cádiz", "Castellón de la Plana", "Ceuta", "Ciudad Real",
    "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara", "Huelva", "Huesca",
    "Jaén", "La Coruña", "Logroño", "Las Palmas de Gran Canaria", "León", "Lleida",
    "Lugo", "Madrid", "Málaga", "Melilla", "Murcia", "Ourense", "Oviedo", "Palencia",
    "Palma", "Pamplona", "Pontevedra", "Salamanca", "San Sebastián", "Santa Cruz de Tenerife",
    "Santander", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia",
    "Valladolid", "Vigo", "Vitoria-Gasteiz", "Zamora", "Zaragoza"
  ];

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
        offer.location,
        offer.description,
        offer.educationLevels?.join(" ")
      ].join(" ").toLowerCase();

      return (
        combined.includes(query) &&
        (!filters.subject || offer.subject?.toLowerCase().includes(filters.subject.toLowerCase())) &&
        (!filters.modality || offer.modality?.toLowerCase().includes(filters.modality.toLowerCase())) &&
        (offer.price >= filters.priceRange[0]) &&
        (filters.priceRange[1] >= 60 || offer.price <= filters.priceRange[1]) &&
        (!filters.name || offer.userId?.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.location || offer.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
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
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 4, px: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
          >
            ← Volver al inicio
          </Button>
        </Box>
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

          <FormControl fullWidth size="small">
            <InputLabel id="location-label">Ciudad</InputLabel>
            <Select
              labelId="location-label"
              name="location"
              value={filters.location}
              onChange={handleFilter}
              label="Ciudad"
            >
              <MenuItem value="">Todas</MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ px: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                fontSize: "1rem",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              Precio por hora: {filters.priceRange[0]}€ -{" "}
              {filters.priceRange[1] >= 60 ? "Más de 50€" : filters.priceRange[1] + "€"}
            </Typography>

            <Slider
              name="priceRange"
              value={filters.priceRange}
              onChange={(e, newValue) =>
                setFilters((prev) => ({ ...prev, priceRange: newValue }))
              }
              valueLabelDisplay="auto"
              min={0}
              max={60}
              step={1}
              disableSwap
              marks={[
                { value: 0, label: "0€" },
                { value: 10, label: "10€" },
                { value: 20, label: "20€" },
                { value: 30, label: "30€" },
                { value: 40, label: "40€" },
                { value: 50, label: "" },
                { value: 51, label: "Más de 50€" },
              ]}
              sx={{
                height: 2,
                mt: 1,
                "& .MuiSlider-markLabel": {
                  fontSize: "0.8rem",
                },
                "& .MuiSlider-valueLabel": {
                  fontSize: "0.8rem",
                },
                "& .MuiSlider-thumb": {
                  width: 14,
                  height: 14,
                },
              }}
            />
          </FormControl>

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
                  <strong>Ciudad:</strong> {offer.location}
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

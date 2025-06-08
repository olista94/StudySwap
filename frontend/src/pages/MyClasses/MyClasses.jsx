import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { API_TUTORS } from "../../config/apiConfig";

const modalities = ["Presencial", "Online", "Ambas"];
const educationLevels = ["ESO", "Bachillerato", "FP", "Universidad", "Oposiciones", "Postgrado", "EBAU", "Idiomas"];
const cities = [
  "A Coruña", "Albacete", "Alicante", "Almería", "Ávila", "Badajoz", "Barcelona", "Bilbao", "Burgos",
  "Cáceres", "Cádiz", "Castellón de la Plana", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca",
  "Girona", "Granada", "Guadalajara", "Huelva", "Huesca", "Jaén", "Logroño",
  "Las Palmas de Gran Canaria", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Melilla",
  "Murcia", "Ourense", "Oviedo", "Palencia", "Palma", "Pamplona", "Pontevedra", "Salamanca",
  "San Sebastián", "Santa Cruz de Tenerife", "Santander", "Segovia", "Sevilla", "Soria",
  "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vigo", "Vitoria-Gasteiz",
  "Zamora", "Zaragoza"
];

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editForm, setEditForm] = useState({
    subject: "",
    price: "",
    modality: "",
    location: "",
    description: "",
    educationLevels: []
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem("studyswap_token");
    try {
      const res = await fetch(`${API_TUTORS}/my-classes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("No se pudieron obtener las clases");
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("studyswap_token");
    try {
      const res = await fetch(`${API_TUTORS}/${selectedClass._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al eliminar clase");
      setClasses(classes.filter(c => c._id !== selectedClass._id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const handleEdit = async () => {
    const token = localStorage.getItem("studyswap_token");
    try {
      const res = await fetch(`${API_TUTORS}/${selectedClass._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) throw new Error("Error al actualizar clase");

      const updated = await res.json();
      setClasses(classes.map(c => (c._id === updated._id ? updated : c)));
      setEditDialogOpen(false);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const openEditDialog = (cls) => {
    setSelectedClass(cls);
    setEditForm({
      subject: cls.subject,
      price: cls.price,
      modality: cls.modality,
      location: cls.location,
      description: cls.description,
      educationLevels: cls.educationLevels || []
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (cls) => {
    setSelectedClass(cls);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📈 Mis clases particulares</Typography>
      {message && <Typography color="error">{message}</Typography>}

      <Grid container spacing={3}>
        {classes.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Asignatura: {offer.subject}</Typography>
                <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                  {offer.educationLevels.map(level => (
                    <Chip key={level} label={level} size="small" />
                  ))}
                </Stack>
                <Typography variant="body2">💰 {offer.price} €/hora</Typography>
                <Typography variant="body2">🌐 Modalidad: {offer.modality}</Typography>
                <Typography variant="body2">📍 Ciudad: {offer.location}</Typography>
                <Typography variant="body2">Descripción: {offer.description}</Typography>

                <Stack direction="row" spacing={1} mt={2}>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEditDialog(offer)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => openDeleteDialog(offer)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal edición */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
        <DialogTitle>Editar clase</DialogTitle>
        <DialogContent>
          <TextField label="Asignatura" fullWidth margin="dense" value={editForm.subject}
            onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} />
          <TextField label="Precio" fullWidth margin="dense" type="number" value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />

          <FormControl fullWidth margin="dense">
            <InputLabel>Modalidad</InputLabel>
            <Select value={editForm.modality} onChange={(e) => setEditForm({ ...editForm, modality: e.target.value })} label="Modalidad">
              {modalities.map((mod) => (
                <MenuItem key={mod} value={mod}>{mod}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Ciudad</InputLabel>
            <Select value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} label="Ciudad">
              {cities.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Descripción" fullWidth multiline rows={3} margin="dense" value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />

          <FormControl fullWidth margin="dense">
            <InputLabel>Niveles educativos</InputLabel>
            <Select
              multiple
              value={editForm.educationLevels}
              onChange={(e) => setEditForm({ ...editForm, educationLevels: e.target.value })}
              input={<OutlinedInput label="Niveles educativos" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {educationLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  <Checkbox checked={editForm.educationLevels.includes(level)} />
                  <ListItemText primary={level} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEdit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>¿Eliminar clase?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de eliminar la clase <strong>{selectedClass?.subject}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

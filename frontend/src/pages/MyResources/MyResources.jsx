import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./MyResources.css";

import { API_BASE, API_RESOURCES } from "../../config/apiConfig";

export default function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [resourceToEdit, setResourceToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", subject: "", year: "" });

  const handleUpdateResource = async () => {
    const token = localStorage.getItem("studyswap_token");

    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    formData.append("subject", editForm.subject);
    formData.append("university", editForm.university);
    formData.append("year", editForm.year);

    if (editForm.newFile) {
      formData.append("file", editForm.newFile);
    }

    try {
      const res = await fetch(`${API_RESOURCES}/${resourceToEdit._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const updated = await res.json();

      if (!res.ok) throw new Error(updated.message || "Error al actualizar recurso");

      setResources((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setResourceToEdit(null);
    } catch (err) {
      console.error("❌ Error al actualizar:", err.message);
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem("studyswap_token");
      try {
        const res = await fetch(API_RESOURCES, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("studyswap_user"));
        const mine = data.filter((r) => r.uploadedBy && r.uploadedBy._id === user._id);
        setResources(mine);
      } catch (err) {
        console.error(err);
        setError("Error al cargar recursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const confirmDelete = (resource) => {
    setResourceToDelete(resource);
  };

  const cancelDelete = () => {
    setResourceToDelete(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("studyswap_token");
    try {
      const res = await fetch(`${API_RESOURCES}/${resourceToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al eliminar recurso");

      setResources((prev) => prev.filter((r) => r._id !== resourceToDelete._id));
      setResourceToDelete(null);
    } catch (err) {
      console.error("❌", err.message);
      setError(err.message);
      setResourceToDelete(null);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📁 Mis apuntes subidos
      </Typography>

      {loading ? (
        <Stack alignItems="center" sx={{ mt: 5 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Cargando recursos...
          </Typography>
        </Stack>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : resources.length === 0 ? (
        <Alert severity="info">No has subido ningún recurso todavía.</Alert>
      ) : (
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource._id}>
              <Card className="myresources-card">
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {resource.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }} useFlexGap flexWrap="wrap">
                    <Chip label={resource.subject} variant="outlined" />
                    <Chip label={resource.university} variant="outlined" />
                    <Chip label={`Año: ${resource.year}`} variant="outlined" />
                  </Stack>
                </CardContent>

                <CardActions>
                  <Tooltip title="Ver archivo">
                    <IconButton
                      color="primary"
                      component="a"
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar recurso">
                    <IconButton
                      color="text"
                      onClick={() => {
                        setResourceToEdit(resource);
                        setEditForm({ title: resource.title, description: resource.description, subject: resource.subject, year: resource.year });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar recurso">
                    <IconButton color="error" onClick={() => confirmDelete(resource)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={!!resourceToDelete} onClose={cancelDelete}>
        <DialogTitle>¿Eliminar recurso?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar <strong>{resourceToDelete?.title}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={!!resourceToEdit} onClose={() => setResourceToEdit(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar recurso</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Asignatura"
            fullWidth
            multiline
            rows={1}
            value={editForm.subject}
            onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Año"
            fullWidth
            multiline
            rows={1}
            value={editForm.year}
            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Archivo actual:
            </Typography>
            <Button
              variant="outlined"
              size="small"
              href={resourceToEdit?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver archivo actual
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Puedes subir un nuevo archivo si deseas reemplazarlo:
            </Typography>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.md"
              onChange={(e) => setEditForm({ ...editForm, newFile: e.target.files[0] })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResourceToEdit(null)}>Cancelar</Button>
          <Button onClick={handleUpdateResource} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

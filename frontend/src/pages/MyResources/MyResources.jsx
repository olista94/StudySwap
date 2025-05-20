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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import "./MyResources.css";

export default function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resourceToDelete, setResourceToDelete] = useState(null); // recurso pendiente de eliminar

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem("studyswap_token");
      try {
        const res = await fetch("http://localhost:3000/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("studyswap_user"));
        const mine = data.filter((r) => r.uploadedBy._id === user._id);
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
      const res = await fetch(`http://localhost:3000/api/resources/${resourceToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al eliminar recurso");

      // Eliminado correctamente, actualizamos la lista
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
        📁 Mis recursos subidos
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
                      href={`http://localhost:3000${resource.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar recurso">
                    <IconButton
                      color="secondary"
                      component={Link}
                      to={`/edit-resource/${resource._id}`}
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
    </Container>
  );
}

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const token = localStorage.getItem("studyswap_token");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/resources/admin/manage-resources`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar recursos");

        const data = await res.json();
        setResources(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/resources/${resourceToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResources((prev) => prev.filter((r) => r._id !== resourceToDelete._id));
      setResourceToDelete(null);
    } catch (err) {
      alert("Error al eliminar el recurso");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Lista de apuntes
      </Typography>

      {resources.length === 0 ? (
        <Typography>No hay recursos disponibles.</Typography>
      ) : (
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {resource.description}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    <Chip label={resource.subject} size="small" />
                    <Chip label={resource.university} size="small" />
                    <Chip label={resource.year} size="small" />
                  </Stack>
                  <Typography variant="caption">
                    Subido por: {resource.uploadedBy?.name || "Desconocido"}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  <Button
                    startIcon={<DownloadIcon />}
                    href={`http://localhost:3000/${resource.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    Descargar
                  </Button>

                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    size="small"
                    onClick={() => setResourceToDelete(resource)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de confirmación */}
      <Dialog open={!!resourceToDelete} onClose={() => setResourceToDelete(null)}>
        <DialogTitle>¿Eliminar recurso?</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar <strong>{resourceToDelete?.title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResourceToDelete(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

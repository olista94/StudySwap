import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { API_TUTORS } from "../../config/apiConfig";

export default function TutorList() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tutorToDelete, setTutorToDelete] = useState(null);

  const token = localStorage.getItem("studyswap_token");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(`${API_TUTORS}/admin/manage-tutors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar tutores");

        const data = await res.json();
        setTutors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_TUTORS}/${tutorToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar tutor");

      setTutors((prev) => prev.filter((t) => t._id !== tutorToDelete._id));
      setTutorToDelete(null);
    } catch (err) {
      alert("❌ " + err.message);
      setTutorToDelete(null);
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
        Lista de tutores
      </Typography>

      {tutors.length === 0 ? (
        <Alert severity="info">No hay tutores publicados.</Alert>
      ) : (
        <Grid container spacing={3}>
          {tutors.map((tutor) => (
            <Grid item xs={12} sm={6} md={4} key={tutor._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{tutor.subject}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tutor.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Universidad: {tutor.university}
                  </Typography>
                  <Typography variant="caption">
                    Publicado por: {tutor.uploadedBy?.name || "Desconocido"}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button
                    startIcon={<VisibilityIcon />}
                    href={`mailto:${tutor.contactEmail}`}
                    target="_blank"
                    size="small"
                  >
                    Contactar
                  </Button>

                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    size="small"
                    onClick={() => setTutorToDelete(tutor)}
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
      <Dialog open={!!tutorToDelete} onClose={() => setTutorToDelete(null)}>
        <DialogTitle>¿Eliminar oferta de tutoría?</DialogTitle>
        <DialogContent>
          ¿Deseas eliminar la oferta de <strong>{tutorToDelete?.subject}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTutorToDelete(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

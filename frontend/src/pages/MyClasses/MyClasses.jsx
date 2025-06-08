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
  Box
} from "@mui/material";
import { API_TUTORS } from "../../config/apiConfig";

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
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

    fetchClasses();
  }, []);

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

      {classes.length === 0 ? (
        <Typography>No has publicado ninguna clase todavía.</Typography>
      ) : (
        <Grid container spacing={3}>
          {classes.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Asignatura/s: {offer.subject}</Typography>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    {offer.educationLevels.map(level => (
                      <Chip key={level} label={level} size="small" />
                    ))}
                  </Stack>
                  <Typography variant="body2">💰 {offer.price} €/hora</Typography>
                  <Typography variant="body2">🌐 Modalidad: {offer.modality}</Typography>
                  <Typography variant="body2">📍 Ciudad: {offer.location}</Typography>
                  <Typography variant="body2">Descripción: {offer.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

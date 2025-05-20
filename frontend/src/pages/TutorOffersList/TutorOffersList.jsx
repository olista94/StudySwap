import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Container
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import "./TutorOffersList.css";

export default function TutorOffersList() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/tutors")
      .then(res => res.json())
      .then(setOffers)
      .catch(err => console.error("Error al cargar ofertas:", err));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        🎓 Profesores disponibles
      </Typography>

      <Stack spacing={3}>
        {offers.map((offer) => (
          <Card key={offer._id} className="tutor-card" sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {offer.subject} —{" "}
                <Typography component="span" color="text.secondary">
                  {offer.userId.name}
                </Typography>
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>{offer.description}</Typography>
              <Typography variant="body2"><strong>Precio:</strong> {offer.price}€/h</Typography>
              <Typography variant="body2"><strong>Modalidad:</strong> {offer.modality}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}><strong>Disponibilidad:</strong> {offer.availability}</Typography>

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<EmailIcon />}
                href={`mailto:${offer.userId.email}`}
              >
                Contactar
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

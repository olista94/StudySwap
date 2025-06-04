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
  Modal
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import "./TutorOffersList.css";

export default function TutorOffersList() {
  const [offers, setOffers] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    fetch("https://studyswap-2ejx.onrender.com/api/tutors")
      .then(res => res.json())
      .then(setOffers)
      .catch(err => console.error("Error al cargar ofertas:", err));
  }, []);

  const handleOpen = (img) => {
    setActiveImage(img);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        🎓 Profesores disponibles
      </Typography>

      <Stack spacing={3}>
        {offers.map((offer) => (
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
                href={`mailto:${offer.userId?.email}`}
              >
                Contactar
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

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
  );
}

import { Box, Container, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#040f0f",
        color: "#FCFFFC",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          © {new Date().getFullYear()} StudySwap · Todos los derechos reservados
        </Typography>
        {/* <Typography variant="body2">
          <Link href="/explorer" underline="hover" color="#2BA84A" sx={{ mx: 1 }}>
            Explorar
          </Link>
          <Link href="/upload" underline="hover" color="#2BA84A" sx={{ mx: 1 }}>
            Subir recursos
          </Link>
          <Link href="/tutors" underline="hover" color="#2BA84A" sx={{ mx: 1 }}>
            Profesores
          </Link>
        </Typography> */}
      </Container>
    </Box>
  );
}

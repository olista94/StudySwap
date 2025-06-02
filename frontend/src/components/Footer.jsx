import { Box, Container, Typography, Stack, Link, Modal, Paper } from "@mui/material";
import { useState, useEffect } from "react"; // Importa useEffect
import "./Footer.css";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [showFooter, setShowFooter] = useState(false); // Nuevo estado para controlar la visibilidad

  const handleOpen = (type) => {
    setContent(type);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getModalContent = () => {
    if (content === "contact") {
      return (
        <>
          <Typography variant="h6">Contact</Typography>
          <Typography>Email: olista94@gmail.com</Typography>
          <Typography>Phone: +34 617 595 452</Typography>
        </>
      );
    }

    if (content === "about") {
      return (
        <>
          <Typography variant="h6">About</Typography>
          <Typography>
            Soy Oscar, desarrollador web full-stack. Esta plataforma ha sido creada para conectar estudiantes y facilitar el intercambio de recursos académicos.
            <br />
            Este es mi proyecto final del <strong>Máster de desarrollo web full-stack & IA</strong> de Evolve Academy.
            <br />
            Para ver más proyectos, visita mi perfil de <Link href="https://github.com/olista94" target="_blank">GitHub</Link>
          </Typography>
        </>
      );
    }

    return null;
  };

  // Lógica para detectar el scroll y mostrar/ocultar el footer
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.body.offsetHeight;
      const threshold = 100; // Puedes ajustar este valor

      if (scrollPosition >= documentHeight - threshold) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpia el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

  return (
    // Condicionalmente renderiza el footer basado en showFooter
    // Opcional: puedes añadir una clase para transiciones suaves en CSS
    <Box component="footer" className={`footer ${showFooter ? 'show' : ''}`}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="center" spacing={4} className="footer-links">
          <Link component="button" onClick={() => handleOpen("contact")} className="footer-link">
            Contact
          </Link>
          <Link component="button" onClick={() => handleOpen("about")} className="footer-link">
            About
          </Link>
        </Stack>

        <Typography variant="body2" align="center" className="footer-copy">
          © {new Date().getFullYear()} StudySwap · Todos los derechos reservados
        </Typography>
      </Container>

      <Modal open={open} onClose={handleClose}>
        <Paper className="footer-modal">
          {getModalContent()}
        </Paper>
      </Modal>
    </Box>
  );
}
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#248232",  // Verde medio
    },
    secondary: {
      main: "#2BA84A",  // Verde claro
    },
    background: {
      default: "#FCFFFC", // Blanco suave
    },
    text: {
      primary: "#040F0F", // Oscuro principal
    },
  },
  typography: {
    fontFamily: "'Segoe UI', sans-serif",
  },
  shape: {
    borderRadius: 6,
  },
});

export default theme;

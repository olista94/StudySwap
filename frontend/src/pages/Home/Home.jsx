import { Typography, Box, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [option, setOption] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const value = event.target.value;
    setOption(value);

    // Redirigir según la opción elegida
    if (value === "tutors") navigate("/tutors");
    if (value === "resources") navigate("/explorer");
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 10,
        px: 2,
        textAlign: "center",
        backgroundImage: `url("/images/wallpaper.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Stack spacing={6} sx={{ width: "100%", maxWidth: 800 }}>
        <Typography variant="h2" color="text" sx={{ fontWeight: "bold" }}>
          Conecta estudiantes, comparte apuntes y mejora tu aprendizaje
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Aquí puedes encontrar recursos de estudio, publicar tus propios apuntes y conectar con estudiantes para dar o recibir clases particulares.
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="select-label">¿Qué te gustaría ver hoy?</InputLabel>
          <Select
            labelId="select-label"
            value={option}
            label="¿Qué te gustaría ver hoy?"
            onChange={handleChange}
            sx={{ bgcolor: "white" }}
          >
            <MenuItem value="tutors">Clases particulares</MenuItem>
            <MenuItem value="resources">Apuntes y materiales</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}

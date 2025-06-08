import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Box,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./PublicResources.css";

import { API_RESOURCES, API_COMMENTS, API_VOTES } from "../../config/apiConfig";

export default function PublicResources() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ subject: "", university: "", year: "" });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("studyswap_token");

  useEffect(() => {
    const fetchResourcesWithVotesAndComments = async () => {
      try {
        const res = await fetch(`${API_RESOURCES}`);
        const data = await res.json();

        const enriched = await Promise.all(
          data.map(async (r) => {
            let votes = { likes: 0, dislikes: 0 };
            let comments = 0;

            try {
              const resVotes = await fetch(`${API_VOTES}/resources/${r._id}`);
              if (resVotes.ok) votes = await resVotes.json();
            } catch (err) {
              console.error(`Error al obtener votos del recurso ${r._id}:`, err);
            }

            try {
              const resComments = await fetch(`${API_COMMENTS}/resources/${r._id}/comments/count`);
              if (resComments.ok) {
                const json = await resComments.json();
                comments = json.count;
              }
            } catch (err) {
              console.error(`Error al contar comentarios del recurso ${r._id}:`, err);
            }

            return { ...r, votes, comments };
          })
        );

        setResources(enriched);
        setFiltered(enriched);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchResourcesWithVotesAndComments();
  }, []);

  const handleFilter = (e) => {
    const { name, value } = e.target;

    if (name === "search") {
      setSearchQuery(value);
    } else {
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);
    }

    const search = name === "search" ? value.toLowerCase() : searchQuery.toLowerCase();
    const newFilterState = name === "search" ? filters : { ...filters, [name]: value };

    const result = resources.filter((r) => {
      const textFields = [
        r.title,
        r.description,
        r.subject,
        r.university,
        r.year?.toString()
      ].join(" ").toLowerCase();

      return (
        (!newFilterState.subject || r.subject?.toLowerCase().includes(newFilterState.subject.toLowerCase())) &&
        (!newFilterState.university || r.university?.toLowerCase().includes(newFilterState.university.toLowerCase())) &&
        (!newFilterState.year || r.year?.toString().includes(newFilterState.year)) &&
        textFields.includes(search)
      );
    });

    setFiltered(result);
  };

  const handleVote = async (resourceId, value) => {
    try {
      await fetch(`${API_VOTES}/resources/${resourceId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      const res = await fetch(`${API_VOTES}/resources/${resourceId}`);
      const updatedVotes = await res.json();

      setFiltered((prev) =>
        prev.map((r) => (r._id === resourceId ? { ...r, votes: updatedVotes } : r))
      );
    } catch (err) {
      alert("Error al votar.");
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

  return (
    <>
      {!token && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 4, px: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
          >
            ← Volver al inicio
          </Button>
        </Box>
      )}

      <Container sx={{ mt: 4, pb: "96px" }}>
        <Typography variant="h4" gutterBottom>
          📚 Apuntes y materiales
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={2}>
          <TextField
            name="search"
            label="¿Qué estás buscando?"
            value={searchQuery}
            onChange={handleFilter}
            fullWidth
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={3}>
          <TextField
            name="subject"
            label="Asignatura"
            value={filters.subject}
            onChange={handleFilter}
            fullWidth
            size="small"
          />
          <TextField
            name="university"
            label="Universidad"
            value={filters.university}
            onChange={handleFilter}
            fullWidth
            size="small"
          />
          <TextField
            name="year"
            label="Año"
            type="number"
            value={filters.year}
            onChange={handleFilter}
            fullWidth
            size="small"
          />
        </Stack>

        {filtered.length === 0 ? (
          <Typography>No hay recursos que coincidan con tu búsqueda.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource._id}>
                <Card
                  component={Link}
                  to={`/resources/${resource._id}`}
                  className="public-resource-card"
                >
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
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }} onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1}>
                      <Button size="small"
                        disabled={!token}
                        onClick={(e) => {
                          e.preventDefault();
                          handleVote(resource._id, 1);
                        }}>
                        👍 {resource.votes?.likes || 0}
                      </Button>
                      <Button size="small"
                        disabled={!token}
                        onClick={(e) => {
                          e.preventDefault();
                          handleVote(resource._id, -1);
                        }}>
                        👎 {resource.votes?.dislikes || 0}
                      </Button>
                    </Stack>
                    <Typography variant="body2">💬 {resource.comments} comentarios</Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

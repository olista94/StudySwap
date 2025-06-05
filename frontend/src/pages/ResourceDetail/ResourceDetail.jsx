import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Stack,
  Paper,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import "./ResourceDetail.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [votes, setVotes] = useState({ likes: 0, dislikes: 0 });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("studyswap_token");
  const user = JSON.parse(localStorage.getItem("studyswap_user") || "null");

  useEffect(() => {
    fetch(`${API_URL}/api/resources/${id}`)
      .then((res) => res.json())
      .then(setResource);

    fetch(`${API_URL}/api/votes/resources/${id}`)
      .then((res) => res.json())
      .then(setVotes);

    fetch(`${API_URL}/api/comments/resources/${id}/comments`)
      .then((res) => res.json())
      .then(setComments);
  }, [id]);

  const handleVote = async (value) => {
    try {
      await fetch(`${API_URL}/api/votes/resources/${id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      const updated = await fetch(`${API_URL}/api/votes/resources/${id}`).then((res) => res.json());
      setVotes(updated);
    } catch (err) {
      alert("Error al votar", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/comments/resources/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      const updated = await fetch(`${API_URL}/api/comments/resources/${id}/comments`).then((res) =>
        res.json()
      );
      setComments(updated);
      setNewComment("");
    } catch (err) {
      alert("Error al comentar", err);
    }
  };

  if (!resource) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="info">Cargando recurso...</Alert>
      </Box>
    );
  }

  return (
    <Box className="detail-container" sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>{resource.title}</Typography>
      <Typography className="description" sx={{ mb: 2 }}>{resource.description}</Typography>

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="body2">📚 <strong>Asignatura:</strong> {resource.subject}</Typography>
        <Typography variant="body2">👨‍🏫 <strong>Profesor:</strong> {resource.professor}</Typography>
        <Typography variant="body2">🏛️ <strong>Universidad:</strong> {resource.university}</Typography>
        <Typography variant="body2">📅 <strong>Año:</strong> {resource.year}</Typography>
        <Typography variant="body2">👤 <strong>Autor:</strong> {resource.uploadedBy?.name}</Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button onClick={() => handleVote(1)} variant="outlined">👍 {votes.likes}</Button>
        <Button onClick={() => handleVote(-1)} variant="outlined">👎 {votes.dislikes}</Button>
      </Stack>

      <Button
        href={`${API_URL}${resource.fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
      >
        Ver archivo
      </Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        💬 Comentarios ({comments.length})
      </Typography>

      <Stack spacing={2} className="detail-comments" sx={{ mb: 3 }}>
        {comments.map((c) => (
          <Paper key={c._id} elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle2">{c.userId.name}</Typography>
            <Typography variant="body2">{c.content}</Typography>
          </Paper>
        ))}
      </Stack>

      {user && (
        <Box component="form" onSubmit={handleComment} className="detail-comment-form">
          <TextField
            multiline
            minRows={3}
            fullWidth
            label="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="success">
            Enviar
          </Button>
        </Box>
      )}
    </Box>
  );
}

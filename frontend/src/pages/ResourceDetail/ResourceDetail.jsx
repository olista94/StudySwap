// src/components/ResourceDetail/ResourceDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ResourceDetail.css";

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [votes, setVotes] = useState({ likes: 0, dislikes: 0 });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("studyswap_token");
  const user = JSON.parse(localStorage.getItem("studyswap_user") || "null");

  useEffect(() => {
    fetch(`http://localhost:3000/api/resources/${id}`)
      .then(res => res.json())
      .then(setResource);

    fetch(`http://localhost:3000/api/votes/resources/${id}`)
      .then(res => res.json())
      .then(setVotes);

    fetch(`http://localhost:3000/api/comments/resources/${id}/comments`)
      .then(res => res.json())
      .then(setComments);
  }, [id]);

  const handleVote = async value => {
    try {
      await fetch(`http://localhost:3000/api/votes/resources/${id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      const updated = await fetch(`http://localhost:3000/api/votes/resources/${id}`).then(res => res.json());
      setVotes(updated);
    } catch (err) {
      alert("Error al votar", err);
    }
  };

  const handleComment = async e => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3000/api/comments/resources/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      const updated = await fetch(`http://localhost:3000/api/comments/resources/${id}/comments`).then(res => res.json());
      setComments(updated);
      setNewComment("");
    } catch (err) {
      alert("Error al comentar", err);
    }
  };

  if (!resource) return <p className="detail-loading">Cargando recurso...</p>;

  return (
    <div className="detail-container">
      <h2>{resource.title}</h2>
      <p className="description">{resource.description}</p>

      <div className="detail-meta">
        <span>Asignatura: {resource.subject}</span>
        <span>Profesor: {resource.professor}</span>
        <span>Universidad: {resource.university}</span>
        <span>Año: {resource.year}</span>
        <span>Autor: {resource.uploadedBy?.name}</span>
      </div>

      <div className="detail-votes">
        <button onClick={() => handleVote(1)}>👍 {votes.likes}</button>
        <button onClick={() => handleVote(-1)}>👎 {votes.dislikes}</button>
      </div>

      <a
        href={`http://localhost:3000${resource.fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="detail-btn"
      >
        Ver archivo
      </a>

      <hr />

      <h5>💬 Comentarios ({comments.length})</h5>
      <ul className="detail-comments">
        {comments.map(c => (
          <li key={c._id}>
            <strong>{c.userId.name}</strong> dijo:
            <p>{c.content}</p>
          </li>
        ))}
      </ul>

      {user && (
        <form onSubmit={handleComment} className="detail-comment-form">
          <textarea
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            required
          />
          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}

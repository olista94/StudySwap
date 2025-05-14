// src/components/MyResources/MyResources.jsx
import { useEffect, useState } from "react";
import "./MyResources.css";

export default function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem("studyswap_token");
      try {
        const res = await fetch("http://localhost:3000/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("studyswap_user"));
        const mine = data.filter(r => r.uploadedBy._id === user._id);
        setResources(mine);
      } catch (err) {
        console.error(err);
        setError("Error al cargar recursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) return <p className="myresources-loading">Cargando recursos...</p>;
  if (error) return <p className="myresources-error">{error}</p>;

  return (
    <div className="myresources-container">
      <h2>📁 Mis recursos subidos</h2>
      {resources.length === 0 ? (
        <p className="myresources-empty">No has subido ningún recurso todavía.</p>
      ) : (
        <div className="myresources-grid">
          {resources.map(resource => (
            <div key={resource._id} className="myresources-card">
              <div className="myresources-card-body">
                <h5>{resource.title}</h5>
                <p>{resource.description}</p>
                <div className="myresources-meta">
                  <span>{resource.subject}</span>
                  <span>{resource.university}</span>
                  <span>{resource.year}</span>
                </div>
                <a
                  href={`http://localhost:3000${resource.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="myresources-btn"
                >
                  Ver archivo
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

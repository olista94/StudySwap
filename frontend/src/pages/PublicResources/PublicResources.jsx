import { useEffect, useState } from "react";
import "./PublicResources.css";
import { Link } from "react-router-dom";

export default function PublicResources() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ subject: "", university: "", year: "" });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("studyswap_token");

  useEffect(() => {
    const fetchResourcesWithVotes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/resources");
        const data = await res.json();

        const enriched = await Promise.all(
          data.map(async (r) => {
            try {
              const resVotes = await fetch(`http://localhost:3000/api/votes/resources/${r._id}`);
              const votes = await resVotes.ok ? resVotes.json() : { likes: 0, dislikes: 0 };
              return { ...r, votes };
            } catch {
              return { ...r, votes: { likes: 0, dislikes: 0 } };
            }
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

    fetchResourcesWithVotes();
  }, []);

  const handleFilter = e => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const result = resources.filter(r =>
      (!newFilters.subject || r.subject?.toLowerCase().includes(newFilters.subject.toLowerCase())) &&
      (!newFilters.university || r.university?.toLowerCase().includes(newFilters.university.toLowerCase())) &&
      (!newFilters.year || r.year?.toString().includes(newFilters.year))
    );
    setFiltered(result);
  };

  const handleVote = async (resourceId, value) => {
    if (!token) return alert("Debes iniciar sesión para votar.");

    try {
      await fetch(`http://localhost:3000/api/votes/resources/${resourceId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });

      const res = await fetch(`http://localhost:3000/api/votes/resources/${resourceId}`);
      const updatedVotes = await res.json();

      setFiltered((prev) =>
        prev.map((r) =>
          r._id === resourceId ? { ...r, votes: updatedVotes } : r
        )
      );
    } catch (err) {
      alert("Error al votar.");
      console.error(err);
    }
  };

  if (loading) return <p className="public-loading">Cargando apuntes...</p>;

  return (
    <div className="public-container">
      <h2>📚 Explora recursos académicos</h2>

      <div className="public-filters">
        <input name="subject" placeholder="Asignatura" value={filters.subject} onChange={handleFilter} />
        <input name="university" placeholder="Universidad" value={filters.university} onChange={handleFilter} />
        <input name="year" type="number" placeholder="Año" value={filters.year} onChange={handleFilter} />
      </div>

      {filtered.length === 0 ? (
        <p className="public-empty">No hay recursos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="public-grid">
          {filtered.map(resource => (
            <Link to={`/resources/${resource._id}`} className="public-card-link" key={resource._id}>
              <div className="public-card">
                <h5>{resource.title}</h5>
                <p>{resource.description}</p>
                <div className="meta">
                  <span>{resource.subject}</span>
                  <span>{resource.university}</span>
                  <span>{resource.year}</span>
                </div>

                <div className="vote-buttons" onClick={e => e.stopPropagation()}>
                  <button onClick={(e) => { e.preventDefault(); handleVote(resource._id, 1); }}>👍 {resource.votes?.likes || 0}</button>
                  <button onClick={(e) => { e.preventDefault(); handleVote(resource._id, -1); }}>👎 {resource.votes?.dislikes || 0}</button>
                </div>

                <a
                  href={`http://localhost:3000${resource.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="public-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver archivo
                </a>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("studyswap_user");
    if (!u) return navigate("/login");
    setUser(JSON.parse(u));
  }, []);

  if (!user) return null;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Hola, <span className="text-success">{user.name}</span> 👋</h2>
      <div className="card-custom">
        <p>¿Qué te gustaría hacer hoy?</p>
        <div className="d-grid gap-2">
          <button className="btn btn-custom" onClick={() => navigate("/upload")}>
            📤 Subir un nuevo apunte
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/my-resources")}>
            📁 Ver mis recursos
          </button>
        </div>
      </div>
    </div>
  );
}

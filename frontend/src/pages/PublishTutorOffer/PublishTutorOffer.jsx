import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PublishTutorOffer.css";

export default function PublishTutorOffer() {
  const [form, setForm] = useState({
    subject: "",
    description: "",
    price: "",
    modality: "online",
    availability: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("studyswap_token");

    try {
      const res = await fetch("http://localhost:3000/api/tutors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error al publicar oferta");

      // ✅ Mensaje + redirección
      setMessage("✅ Oferta publicada");
      setTimeout(() => navigate("/tutors"), 1500); // Redirige tras 1.5s
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="publish-container container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Publicar clases particulares</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control" name="subject" placeholder="Asignatura" required onChange={handleChange} value={form.subject} />
        <textarea className="form-control" name="description" placeholder="Descripción" onChange={handleChange} value={form.description} />
        <input className="form-control" type="number" name="price" placeholder="Precio por hora (€)" required onChange={handleChange} value={form.price} />
        <select className="form-control" name="modality" onChange={handleChange} value={form.modality}>
          <option value="online">Online</option>
          <option value="presencial">Presencial</option>
          <option value="ambas">Ambas</option>
        </select>
        <input className="form-control" name="availability" placeholder="Disponibilidad" onChange={handleChange} value={form.availability} />
        <button className="btn btn-success w-100 mt-3">Publicar</button>
      </form>
    </div>
  );
}

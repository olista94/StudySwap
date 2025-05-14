import { useState } from "react";
import "./Upload.css";

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    professor: "",
    university: "",
    year: "",
    file: null
  });

  const [message, setMessage] = useState("");

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("studyswap_token");

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));

    try {
      const res = await fetch("http://localhost:3000/api/resources", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (!res.ok) throw new Error("Error al subir el recurso");
      setMessage("✅ Recurso subido correctamente");
      setForm({ title: "", description: "", subject: "", professor: "", university: "", year: "", file: null });
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="upload-container container mt-5">
      <h2 className="mb-3">📤 Subir apunte</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Título</label>
          <input name="title" className="form-control" required value={form.title} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Descripción</label>
          <textarea name="description" className="form-control" value={form.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Asignatura</label>
          <input name="subject" className="form-control" required value={form.subject} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Profesor</label>
          <input name="professor" className="form-control" value={form.professor} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Universidad</label>
          <input name="university" className="form-control" value={form.university} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Año</label>
          <input name="year" type="number" className="form-control" value={form.year} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Archivo (PDF o imagen)</label>
          <input name="file" type="file" className="form-control" accept=".pdf,.md,.jpg,.png,.jpeg" required onChange={handleChange} />
        </div>
        <button className="btn btn-success w-100" type="submit">Subir recurso</button>
      </form>
    </div>
  );
}

// Archivo: src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(form);
      localStorage.setItem("studyswap_token", token);
      localStorage.setItem("studyswap_user", JSON.stringify(user));
      window.location.href = "/"; // redirigir al dashboard o página principal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-3">Iniciar sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" type="email" className="form-control" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input name="password" type="password" className="form-control" required onChange={handleChange} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Entrar</button>
      </form>
    </div>
  );
}

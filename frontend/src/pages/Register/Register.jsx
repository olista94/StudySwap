import { useState } from "react";
import { registerUser } from "../../services/authService";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", university: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="mb-3">Crear cuenta</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">✅ ¡Registro exitoso! Ya puedes iniciar sesión.</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nombre</label>
            <input name="name" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Universidad</label>
            <input name="university" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input name="email" type="email" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Contraseña</label>
            <input name="password" type="password" className="form-control" required onChange={handleChange} />
          </div>
          <button className="btn btn-success w-100" type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

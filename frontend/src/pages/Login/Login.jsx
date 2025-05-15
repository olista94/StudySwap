import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import './Login.css';

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const user = localStorage.getItem("studyswap_user");
    if (user) {
      navigate("/explorer");
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(form);
      localStorage.setItem("studyswap_token", token);
      localStorage.setItem("studyswap_user", JSON.stringify(user));
      navigate("/explorer");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return null;

  return (
    <div className="login-container">
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
    </div>
  );
}

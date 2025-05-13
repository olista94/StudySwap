import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", university: "", email: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("studyswap_user");
    if (!stored) return navigate("/login");

    const user = JSON.parse(stored);
    setUser(user);
    setForm({ name: user.name, university: user.university, email: user.email });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePassChange = e => setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const saveProfile = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("studyswap_token");

      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      const updated = await res.json();
      localStorage.setItem("studyswap_user", JSON.stringify(updated));
      setUser(updated);
      setMessage("✅ Perfil actualizado correctamente");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const changePassword = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("studyswap_token");

      const res = await fetch("http://localhost:3000/api/users/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passForm),
      });

      if (!res.ok) throw new Error("Error al cambiar la contraseña");

      setMessage("🔐 Contraseña cambiada correctamente");
      setPassForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Mi perfil</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={saveProfile}>
        <h5>Editar datos</h5>
        <div className="mb-3">
          <label>Nombre</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Universidad</label>
          <input name="university" className="form-control" value={form.university} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" className="form-control" type="email" value={form.email} onChange={handleChange} />
        </div>
        <button className="btn btn-success">Guardar cambios</button>
      </form>

      <hr className="my-4" />

      <form onSubmit={changePassword}>
        <h5>Cambiar contraseña</h5>
        <div className="mb-3">
          <label>Contraseña actual</label>
          <input name="currentPassword" type="password" className="form-control" required value={passForm.currentPassword} onChange={handlePassChange} />
        </div>
        <div className="mb-3">
          <label>Nueva contraseña</label>
          <input name="newPassword" type="password" className="form-control" required value={passForm.newPassword} onChange={handlePassChange} />
        </div>
        <button className="btn btn-outline-primary">Cambiar contraseña</button>
      </form>
    </div>
  );
}

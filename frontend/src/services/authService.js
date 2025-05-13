const API = "http://localhost:3000/api/users";

export async function registerUser(data) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al registrar");
  return await res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Email o contraseña incorrectos");
  return await res.json();
}

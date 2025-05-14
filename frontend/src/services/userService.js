const API_URL = "http://localhost:3000/api/users";

export async function updateProfile(data, token) {
  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar perfil");
  return await res.json();
}

export async function changePassword(passData, token) {
  const res = await fetch(`${API_URL}/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passData),
  });

  if (!res.ok) throw new Error("Error al cambiar la contraseña");
  return await res.json();
}

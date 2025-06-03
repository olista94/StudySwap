// import axios from "axios";

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

export const uploadProfileImage = async (formData, token) => {
  const res = await fetch(`${API_URL}/me/upload-profile-image`, {
    method: 'POST',
    // ¡IMPORTANTE!: NO ESPECIFIQUES 'Content-Type': 'multipart/form-data' aquí
    // El navegador lo establecerá automáticamente y correctamente con el 'boundary'
    // cuando el 'body' es una instancia de FormData.
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // Pasa directamente la instancia de FormData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al subir la imagen de perfil");
  }
  // Tu backend devuelve un objeto con 'user' dentro
  const responseData = await res.json();
  return responseData.user;
};

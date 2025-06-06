# 📚 StudySwap

**StudySwap** es una plataforma colaborativa donde estudiantes pueden compartir e intercambiar apuntes, exámenes resueltos, casos prácticos y todo tipo de recursos académicos, además de publicar clases particulares. El proyecto ha sido desarrollado como trabajo final de máster, siguiendo un enfoque full stack con React + Node.js + MongoDB.

---

## 🚀 Funcionalidades Principales

- Registro e inicio de sesión con JWT.
- Subida de apuntes y materiales (PDF o texto).
- Sistema de votos y comentarios.
- Filtros por universidad, asignatura, profesor o año.
- Perfil de usuario editable.
- Cambio de contraseña con validación.
- Sistema de reputación.
- Interfaz responsive (Mobile First) con Bootstrap.

---

## 🧰 Tecnologías Utilizadas

### Frontend
- React + Vite
- Bootstrap 5
- React Router DOM
- Font Awesome (íconos)
- LocalStorage para autenticación

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Bcrypt (encriptación de contraseñas)
- JSON Web Tokens (autenticación)
- Dotenv, CORS, Helmet

---

## ⚙️ Instalación y Ejecución

### 1. Clona el repositorio
```bash
git clone https://github.com/tuusuario/studyswap.git
cd studyswap
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env    # Configura tu conexión MongoDB
npm run dev
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Visita: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Variables de Entorno

### `.env` del backend
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/studyswap
JWT_SECRET=clave-secreta-segura
```

## Despliegue

Para ver la aplicación de StusySwap debes acceder mediante el link [StudySwap](https://study-swap.vercel.app/)
---

## 👤 Usuarios de Prueba

| Rol   | Email                  | Contraseña |
|-------|------------------------|------------|
| Admin | admin@studyswap.com    | 123        |
| User  | iria@studyswap.com     | 123        |

---

## 💡 Decisiones Técnicas

- **Mobile First:** se priorizó el diseño responsive para adaptarse a móviles desde el inicio.
- **Bootstrap:** se utilizó por su rapidez de maquetación y compatibilidad.
- **Modularidad:** separación clara entre controladores, rutas y modelos.
- **Autenticación JWT:** permite escalabilidad y control desde frontend sin sesiones de servidor.

---

## 📦 Futuras Mejoras

- Integración con Notion/Google Drive.
- Verificación de apuntes por comunidad.
- Sistema de recompensas o gamificación.
- Panel de administración avanzado.

---

## 🧑‍💻 Autor

**Oscar Lista Rivera**  
[LinkedIn](https://www.linkedin.com/in/oscar-lista-rivera)

---

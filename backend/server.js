const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
require('dotenv').config({ path: __dirname + '/.env' });

const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const commentRoutes = require("./routes/commentRoutes");
const voteRoutes = require("./routes/voteRoutes");
const tutorOfferRoutes = require("./routes/tutorOfferRoutes");

// App
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://study-swap.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/tutors', tutorOfferRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  // res.send("🚀 API de StudySwap funcionando correctamente.");
  res.redirect("https://study-swap.vercel.app");
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('🟢 Conectado a MongoDB');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
})
.catch(err => {
  console.error('🔴 Error de conexión a MongoDB:', err.message);
});

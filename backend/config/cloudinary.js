const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function sanitizeFileName(filename) {
  const name = filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/\.[^/.]+$/, "")        // elimina extensión
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .toLowerCase();

  const ext = path.extname(filename).toLowerCase(); // obtiene extensión, e.g. ".pdf"
  return `${name}${ext}`; // agrega de nuevo la extensión limpia
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "resources",
    public_id: `${Date.now()}-${sanitizeFileName(file.originalname)}`,
    resource_type: "raw", // 👈 muy importante para archivos no imagen
  }),
});

module.exports = { cloudinary, storage };

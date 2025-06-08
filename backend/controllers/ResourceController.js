const Resource = require('../models/Resource.js');
const { cloudinary } = require("../config/cloudinary");

exports.getAll = async (req, res) => {
  const filters = req.query;

  try {
    const resources = await Resource.find(filters).populate('uploadedBy', 'name');
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener recursos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name');
    if (!resource) return res.status(404).json({ message: 'Recurso no encontrado' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener recurso' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, fileUrl, fileType, subject, professor, university, year } = req.body;

    const resource = new Resource({
      title,
      description,
      fileUrl,
      fileType,
      subject,
      professor,
      university,
      year,
      uploadedBy: req.user.id
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear recurso', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Recurso no encontrado" });

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Actualiza campos
    const { title, description, subject, university, year } = req.body;
    if (title) resource.title = title;
    if (description) resource.description = description;
    if (subject) resource.subject = subject;
    if (university) resource.university = university;
    if (year) resource.year = year;

    // Si se ha subido nuevo archivo
    if (req.file) {
      resource.fileUrl = req.file.path; // path contiene la URL pública de    Cloudinary
      resource.fileType = getFileType(req.file.originalname);
      resource.cloudinary_id = req.file.public_id;
    }

    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar recurso" });
  }
};

// Subida a Cloudinary
exports.uploadWithFile = async (req, res) => {
  try {
    const { title, description, subject, professor, university, year } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "Archivo no enviado" });

    // No necesitas subir nada manualmente, req.file ya viene con la URL
    const fileType = getFileType(file.originalname);

    const resource = new Resource({
      title,
      description,
      fileUrl: file.path, // 👈 URL pública de Cloudinary
      fileType,
      subject,
      professor,
      university,
      year,
      uploadedBy: req.user.id,
      cloudinary_id: file.filename || file.public_id, // importante para eliminar luego
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al subir recurso", error: err.message });
  }
};

// Función para detectar el tipo de archivo
function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'md') return 'markdown';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'image';
  return 'other';
}

exports.remove = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Recurso no encontrado' });

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // 🔥 Eliminar archivo de Cloudinary si existe
    if (resource.cloudinary_id) {
      await cloudinary.uploader.destroy(resource.cloudinary_id, {
        resource_type: "raw", // importante si son PDF o archivos no imagen
      });
    }

    await resource.deleteOne();
    res.json({ message: 'Recurso eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar recurso' });
  }
};

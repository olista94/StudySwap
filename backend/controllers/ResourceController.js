const Resource = require('../models/Resource.js');

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
    if (!resource) return res.status(404).json({ message: 'Recurso no encontrado' });

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    Object.assign(resource, req.body);
    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar recurso' });
  }
};

exports.remove = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Recurso no encontrado' });

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await resource.deleteOne();
    res.json({ message: 'Recurso eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar recurso' });
  }
};

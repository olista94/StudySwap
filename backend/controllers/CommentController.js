const Comment = require('../models/Comment');

exports.getByResource = async (req, res) => {
  try {
    const comments = await Comment.find({ resourceId: req.params.id }).populate('userId', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
};

exports.countByResource = async (req, res) => {
  try {
    const count = await Comment.countDocuments({ resource: req.params.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error al contar comentarios" });
  }
};

exports.create = async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      resourceId: req.params.id,
      userId: req.user.id
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear comentario' });
  }
};

exports.remove = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar comentario' });
  }
};

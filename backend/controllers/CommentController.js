const Comment = require('../models/Comment');

exports.getByResource = async (req, res) => {
  try {
    const comments = await Comment.find({ resource: req.params.id }).populate('author', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
};

exports.create = async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      resource: req.params.id,
      author: req.user.id
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

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar comentario' });
  }
};

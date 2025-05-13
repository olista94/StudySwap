const Vote = require('../models/Vote');
const Resource = require('../models/Resource');

exports.vote = async (req, res) => {
  const { type } = req.body;

  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ message: 'Tipo de voto inválido' });
  }

  try {
    const existing = await Vote.findOne({ user: req.user.id, resource: req.params.id });

    if (existing) {
      await existing.deleteOne();
    }

    const newVote = new Vote({ user: req.user.id, resource: req.params.id, type });
    await newVote.save();

    // Actualiza contador del recurso
    const inc = type === 'like' ? { likes: 1 } : { dislikes: 1 };
    await Resource.findByIdAndUpdate(req.params.id, { $inc: inc });

    res.json({ message: 'Voto registrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar voto' });
  }
};

exports.removeVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({ user: req.user.id, resource: req.params.id });
    if (!vote) return res.status(404).json({ message: 'No hay voto registrado' });

    const dec = vote.type === 'like' ? { likes: -1 } : { dislikes: -1 };
    await Resource.findByIdAndUpdate(req.params.id, { $inc: dec });

    await vote.deleteOne();
    res.json({ message: 'Voto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar voto' });
  }
};

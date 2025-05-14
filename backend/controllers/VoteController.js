const Vote = require('../models/Vote');
const Resource = require('../models/Resource');

exports.vote = async (req, res) => {
  const { value } = req.body; // debe ser 1 (like) o -1 (dislike)

  if (![1, -1].includes(value)) {
    return res.status(400).json({ message: 'Valor de voto inválido' });
  }

  try {
    const existing = await Vote.findOne({ userId: req.user.id, resourceId: req.params.id });

    if (existing) {
      // Si cambia el valor del voto, se actualiza
      if (existing.value !== value) {
        const diff = value - existing.value; // +2 o -2
        await existing.updateOne({ value });

        const update = value === 1 ? { likes: 1, dislikes: -1 } : { likes: -1, dislikes: 1 };
        await Resource.findByIdAndUpdate(req.params.id, { $inc: update });

        return res.json({ message: 'Voto actualizado' });
      }

      // Si es igual, se ignora (ya ha votado igual)
      return res.status(200).json({ message: 'Ya has votado' });
    }

    // Nuevo voto
    await Vote.create({ userId: req.user.id, resourceId: req.params.id, value });

    const inc = value === 1 ? { likes: 1 } : { dislikes: 1 };
    await Resource.findByIdAndUpdate(req.params.id, { $inc: inc });

    res.status(201).json({ message: 'Voto registrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar voto', error: err.message });
  }
};

exports.removeVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({ userId: req.user.id, resourceId: req.params.id });
    if (!vote) return res.status(404).json({ message: 'No hay voto registrado' });

    const dec = vote.value === 1 ? { likes: -1 } : { dislikes: -1 };
    await Resource.findByIdAndUpdate(req.params.id, { $inc: dec });

    await vote.deleteOne();
    res.json({ message: 'Voto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar voto', error: err.message });
  }
};

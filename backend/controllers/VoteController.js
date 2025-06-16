const Vote = require('../models/Vote');
const Resource = require('../models/Resource');

exports.getVotes = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Recurso no encontrado' });

    res.json({ likes: resource.likes || 0, dislikes: resource.dislikes || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener votos' });
  }
};

exports.vote = async (req, res) => {
  const { value } = req.body;

  if (![1, -1].includes(value)) {
    return res.status(400).json({ message: 'Valor de voto inválido' });
  }

  try {
    const existing = await Vote.findOne({ userId: req.user.id, resourceId: req.params.id });

    if (existing) {
      // Si el voto ya es el mismo, se ignora
      if (existing.value === value) {
        // Deshacer el voto
        const undo = value === 1 ? { likes: -1 } : { dislikes: -1 };
        await Resource.findByIdAndUpdate(req.params.id, { $inc: undo });
        await Vote.deleteOne({ _id: existing._id });

        return res.status(200).json({ message: 'Voto eliminado' });
      }

      // Revertir voto anterior
      const revert = existing.value === 1 ? { likes: -1 } : { dislikes: -1 };
      await Resource.findByIdAndUpdate(req.params.id, { $inc: revert });

      // Aplicar nuevo voto
      existing.value = value;
      await existing.save();

      const apply = value === 1 ? { likes: 1 } : { dislikes: 1 };
      await Resource.findByIdAndUpdate(req.params.id, { $inc: apply });

      return res.json({ message: 'Voto actualizado' });
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

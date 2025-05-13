const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'studyswap-secret';

exports.register = async (req, res) => {
  const { name, email, password, university } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email ya registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash: hashed, university });
    await newUser.save();

    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({
      id: user._id,
      name: user.name,
      role: user.role
    }, SECRET, { expiresIn: '4h' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error en login', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

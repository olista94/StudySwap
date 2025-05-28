const User = require('../models/User.js');
const { sendWelcomeEmail } = require("../services/emailService");
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

    await sendWelcomeEmail(newUser.email, newUser.name);

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

exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener todos los usuarios', error: err.message });
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

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, university, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });


    if (email && email !== user.email) {
      const emailUsed = await User.findOne({ email });
      if (emailUsed) return res.status(400).json({ message: "Email ya registrado" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.university = university || user.university;
    
    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.passwordHash;

    res.json(sanitizedUser);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el perfil", error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Contraseña actual incorrecta" });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al cambiar la contraseña", error: err.message });
  }
};

const User = require('../models/User.js');
const { sendWelcomeEmail } = require("../services/emailService");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'studyswap-secret';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email ya registrado' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash: hashed});
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
  const { name, email } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: "El email ya está registrado por otro usuario." });
      }
    }

    if (name !== undefined) {
      user.name = name;
    }
    if (email !== undefined) {
      user.email = email;
    }

    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: sanitizedUser
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({
        message: "Error de validación al actualizar el perfil",
        errors: errors
      });
    }

    res.status(500).json({
      message: "Error interno del servidor al actualizar el perfil",
      error: err.message
    });
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

exports.updateByAdmin = async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Este email ya está en uso' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    const sanitized = user.toObject();
    delete sanitized.passwordHash;

    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

exports.deleteByAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: `Usuario ${user.name} eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file.path; // URL de Cloudinary proporcionada por multer-storage-cloudinary

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
    }

    const sanitizedUser = updatedUser.toObject();
    delete sanitizedUser.passwordHash;

    res.status(200).json({
      status: 'success',
      message: 'Imagen de perfil actualizada correctamente',
      user: sanitizedUser,
    });
  } catch (err) {
    console.error('Error al subir la imagen de perfil:', err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor al subir la imagen.' });
  }
};

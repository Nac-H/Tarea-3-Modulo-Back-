const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../../models/users');
const apiKeyAuth = require('../../middlewares/apiKey');
const jwtAuth = require('../../middlewares/jwtAuth');

router.post('/', apiKeyAuth, (req, res) => {
  User.saveUser({ id: uuidv4(), ...req.body }, (err, newUser) => {
    if (err) {
      return res.status(500).json({ code: "500", message: "Error al crear usuario" });
    }
    res.status(201).json({ code: "201", message: "Usuario creado", data: { user: newUser } });
  });
});

router.get('/', jwtAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ code: "403", message: "Solo admin puede listar usuarios" });
  }
  User.findAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({ code: "500", message: "Error al listar usuarios" });
    }
    res.status(200).json({ code: "200", message: "Usuarios obtenidos", data: users });
  });
});

router.get('/:id', jwtAuth, (req, res) => {
  User.findUserById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).json({ code: "500", message: "Error al obtener usuario" });
    }
    if (!user) {
      return res.status(404).json({ code: "404", message: "Usuario no encontrado" });
    }
    res.status(200).json({ code: "200", message: "Usuario obtenido", data: { user } });
  });
});

router.put('/:id', jwtAuth, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ code: "403", message: "No tienes permiso para actualizar este usuario" });
  }
  User.updateUser(req.params.id, req.body, (err, updated) => {
    if (err) {
      return res.status(500).json({ code: "500", message: "Error al actualizar usuario" });
    }
    if (!updated) {
      return res.status(404).json({ code: "404", message: "Usuario no encontrado" });
    }
    res.status(200).json({ code: "200", message: "Usuario actualizado", data: { user: updated } });
  });
});

router.delete('/:id', jwtAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ code: "403", message: "Solo admin puede eliminar usuarios" });
  }
  const { User: UserModel } = require('../../schemas/users');
  UserModel.findByIdAndDelete(req.params.id)
    .then(deleted => {
      if (!deleted) {
        return res.status(404).json({ code: "404", message: "Usuario no encontrado" });
      }
      res.status(200).json({ code: "200", message: "Usuario eliminado", data: { user: deleted } });
    })
    .catch(err => {
      res.status(500).json({ code: "500", message: "Error al eliminar usuario" });
    });
});

module.exports = router;

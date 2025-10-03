
const { body, validationResult } = require("express-validator");

const validateEvent = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("Cantidad").isFloat({ gt: 0 }).withMessage("Cantidad debe ser mayor a 0"),
  body("Tipo").isIn(["Ingreso", "Egreso"]).withMessage("Tipo inválido"),
  body("Fecha").isISO8601().withMessage("Fecha debe ser YYYY-MM-DD"),
  body("description").optional().isString().withMessage("Descripción debe ser texto"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: "400", errors: errors.array() });
    }
    next();
  },
];

module.exports = validateEvent;

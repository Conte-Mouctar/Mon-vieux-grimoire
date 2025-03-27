const { checkSchema, validationResult } = require("express-validator");

// Définition du schéma de validation
const signupSchema = checkSchema({
  email: {
    in: ["body"], // Assure que l'email vient du body
    isEmail: {
      errorMessage: "L'email n'est pas valide",
    },
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    isLength: {
      options: { min: 8 },
      errorMessage: "Le mot de passe doit contenir au moins 8 caractères",
    },
  },
});

// Middleware pour gérer les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Exportation des middlewares
module.exports = {
  signupValidator: [signupSchema, validate],
};

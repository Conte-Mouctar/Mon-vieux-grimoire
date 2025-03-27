const { checkSchema } = require("express-validator");

exports.validator = checkSchema({
  email: {
    errorMessage: "Email invalide",
    isEmail: true,
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Le mot de passe doit contenir plus de 8 caractere",
    },
  },
});

const rateLimit = require("express-rate-limit");

const connexionLimitee = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives de connexion, réessayez dans 10 minutes",
});

module.exports = { connexionLimitee };

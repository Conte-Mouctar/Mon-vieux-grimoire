const express = require("express");
const router = express.Router();
const userCrtl = require("../controllers/user");
const { connexionLimitee } = require("../middleware/rateLimit");
//const { validator } = require("../middleware/validator");

router.post("/signup", userCrtl.signUp);
router.post("/login", connexionLimitee, userCrtl.login);

module.exports = router;

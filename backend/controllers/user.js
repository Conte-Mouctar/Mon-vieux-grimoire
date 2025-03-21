require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Tout les champs sont requis " });
    }

    const mdpCryptee = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: mdpCryptee });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur cree avec succes" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const mdpValide = await bcrypt.compare(password, user.password);
    if (!mdpValide) {
      return res.status(401).json({ message: "Mot de passe incorect" });
    }

    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, process.env.MON_TOKEN, {
        expiresIn: "24h",
      }),
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

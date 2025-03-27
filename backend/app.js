require("dotenv").config();
const rateLimit = require("express-rate-limit");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const booksRoute = require("./routes/books");
const userRoute = require("./routes/user");

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

mongoose
  .connect(process.env.MANGO_DB)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.error("Connexion à MongoDB échouée :", error));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Trop de requêtes, réessayez plus tard.",
});

app.use(limiter);
app.use("/api/books", booksRoute);
app.use("/api/auth", userRoute);

module.exports = app;

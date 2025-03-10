const express = require("express");
const mongoose = require("mongoose");

const booksRoute = require("./routes/books");
const userRoute = require("./routes/user");

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Mouctar_Conte:wYq2liPWUjZPz7wM@monvieuxgrimoire.uub2s.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire"
  )
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

app.use("/api/books", booksRoute);
app.use("/api/auth", userRoute);

module.exports = app;

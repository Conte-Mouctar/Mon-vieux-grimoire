const express = require("express");
const data = require("../frontend/public/data/data.json");
const Book = require("./models/books");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Mouctar_Conte:wYq2liPWUjZPz7wM@monvieuxgrimoire.uub2s.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());

app.get((req, res, next) => {
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

/* app.get("/api/books", (req, res, next) => {
  res.status(200).json(data);
}); */

app.get("/api/books", (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/livre/:id", (req, res, next) => {
  Book.findOne({ id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
});

app.post("/api/books", (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;

const express = require("express");
const data = require("../frontend/public/data/data.json");

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

app.get("/api/books", (req, res, next) => {
  res.status(200).json(data);
});

app.get("/livre/:id", (req, res, next) => {
  const { id } = req.params;
  const book = data.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  res.status(200).json(book);
});

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Objet créé !",
  });
});

module.exports = app;

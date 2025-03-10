const Book = require("../models/Book");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des livres" });
  }
};

exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: "ID invalide ou erreur serveur" });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, author, year, genre, imageUrl, userId } = req.body;
    if (!title || !author || !year || !genre || !imageUrl || !userId) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const newBook = new Book({ title, author, year, genre, imageUrl, userId });
    await newBook.save();

    res.status(201).json({ message: "Livre enregistré", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.modifieBook = async (req, res) => {
  try {
    const result = await Book.updateOne(
      { _id: req.params.id },
      { ...req.body }
    );

    res.status(200).json({ message: "Objet modifié !" });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la modification" });
  }
};

exports.suprimeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Objet supprimé !" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "ID invalide ou erreur lors de la suppression" });
  }
};

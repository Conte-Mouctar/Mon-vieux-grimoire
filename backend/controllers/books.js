const Book = require("../models/Book");
const fs = require("fs");

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
    const dataBook = JSON.parse(req.body.book);

    const { title, author, year, genre } = dataBook;
    if (!title || !author || !year || !genre || !req.file) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    const newBook = new Book({
      title,
      author,
      year,
      genre,
      userId: req.auth.userId,
      imageUrl,
      rating: [],
    });
    await newBook.save();

    res.status(201).json({ message: "Livre enregistré", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.modifieBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé !" });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ error: "Non autorisé !" });
    }

    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    delete bookObject._userId;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      bookObject,
      { new: true }
    );

    res.status(200).json({ message: "Livre modifié !", book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.suprimeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autoriseé" });
    }

    const filename = book.imageUrl.split("/images/")[1];
    if (filename) {
      fs.unlink(`images/${filename}`, (err) => {
        if (err)
          console.error("Erreur lors de la suppression de l’image :", err);
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Livre supprimé avec succès !" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "ID invalide ou erreur lors de la suppression" });
  }
};

const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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

    const { title, author, year, genre, ratings } = dataBook;
    const grade = ratings[0].grade;
    if (!title || !author || !year || !genre || !req.file) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const name = req.file.originalname.split(" ").join("_");
    const extention = path.extname(name);
    const baseName = path.basename(name, extention);
    const filename = `${Date.now()}_${baseName}.webp`;
    const routeImage = path.join("images", filename);
    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .resize(600, 800)
      .toFile(routeImage);

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${filename}`;

    const newBook = new Book({
      title,
      author,
      year,
      genre,
      userId: req.auth.userId,
      imageUrl,
      ratings: ratings,
      averageRating: grade,
    });

    await newBook.save();
    res.status(201).json({ message: "Livre enregistré", book: newBook });
  } catch (error) {
    console.error(error);
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

    let filename = null;
    if (req.file) {
      const ancienNom = book.imageUrl.split("/images/")[1];
      const ancienneRoute = path.join("images", ancienNom);
      fs.unlink(ancienneRoute, (err) => {
        if (err) {
          console.error("Erreur suppression image :", err);
        }
      });
      const name = req.file.originalname.split(" ").join("");
      const extention = path.extname(name);
      const basename = path.basename(name, extention);
      filename = `${Date.now()}_${basename}.webp`;
      const routeImage = path.join("images", filename);

      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .resize(400)
        .toFile(routeImage);
    }

    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
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
    console.error(error);
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
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.notationBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, rating } = req.body;

    const book = await Book.findById(id);

    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Veuillez entree un chifre entre 0 et 5 ! " });
    }

    const doublon = book.ratings.find((r) => r.userId === req.auth.userId);
    if (doublon) {
      return res
        .status(400)
        .json({ message: "Vous avait deja donneé une note a ce livre !" });
    }

    book.ratings.push({ userId, grade: rating });

    const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    const moyenne = total / book.ratings.length;
    book.averageRating = moyenne.toFixed(1);

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.bestBook = async (req, res, next) => {
  try {
    const book = await Book.find().sort({ averageRating: -1 }).limit(3);

    if (book.length === 0) {
      return res.status(404).json({ message: "Aucun livre noté trouvé" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des meilleurs livres :",
      error
    );
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

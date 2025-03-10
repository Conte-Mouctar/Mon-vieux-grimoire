const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/", booksCtrl.createBook);
router.put("/:id", booksCtrl.modifieBook);
router.delete("/:id", booksCtrl.suprimeBook);

module.exports = router;

const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/", auth, multer, booksCtrl.createBook);
router.put("/:id", auth, multer, booksCtrl.modifieBook);
router.delete("/:id", auth, booksCtrl.suprimeBook);

module.exports = router;

const express = require("express");
const Book = require("../models/books");
const { createUserJwt } = require("../utils/tokens"); //utility function to generate json we tokens
const security = require("../middleware/security"); // middleware
const router = express.Router();

//get all books with specific keyword
router.get("/:key_word", async (req, res, next) => {
	try {
		const { key_word } = req.params;
		books = await Book.getAllBooksByyKeyword(key_word);

		// console.log("ECDQWCEWCEFWCDWDEWC:", books[0]); --> how to acces each book in the books array

		return res.status(200).json({ books });
	} catch (err) {
		next(err);
	}
});

// get book by id
router.get("/id/:book_id", async (req, res, next) => {
	try {
		const { book_id } = req.params;
		book = await Book.getBookById(book_id);

		return res.status(200).json({ book });
	} catch (err) {
		next(err);
	}
});

module.exports = router;

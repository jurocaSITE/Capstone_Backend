const express = require("express");
// const Book = require("../models/books");
const router = express.Router();

//create a new rating
router.post("/", async (req, res, next) => {
	try {
		const { key_word, offset } = req.params;
		books = await Book.getAllBooksByKeyword(key_word, offset);
		return res.status(200).json({ books });
	} catch (err) {
		next(err);
	}
});

//list all ratings for a book
router.get("/", async (req, res, next) => {
	try {
		const { key_word, offset } = req.params;
		books = await Book.getAllBooksByKeyword(key_word, offset);
		return res.status(200).json({ books });
	} catch (err) {
		next(err);
	}
});

//fetch a single rating
router.get("/:rating_id", async (req, res, next) => {
	try {
		const { key_word, offset } = req.params;
		books = await Book.getAllBooksByKeyword(key_word, offset);
		return res.status(200).json({ books });
	} catch (err) {
		next(err);
	}
});

// update a single rating
router.put("/:rating_id", async (req, res, next) => {
	try {
		const { key_word, offset } = req.params;
		books = await Book.getAllBooksByKeyword(key_word, offset);
		return res.status(200).json({ books });
	} catch (err) {
		next(err);
	}
});


module.exports = router;

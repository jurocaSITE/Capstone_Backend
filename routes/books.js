const express = require("express");
const Book = require("../models/books");
const router = express.Router();

//get all books with specific keyword
router.get("/search/:key_word/:offset?", async (req, res, next) => {
	try {
		const { key_word, offset } = req.params;
		const books = await Book.getAllBooksByKeyword(key_word, offset);

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
		const book = await Book.getBookById(book_id);

		return res.status(200).json({ book });
	} catch (err) {
		next(err);
	}
});

// get books by author
router.get("/author/:author_name", async (req, res, next) => {
	try {
		const { author_name } = req.params;
		const books = await Book.getBooksByAuthor(author_name);

		return res.status(200).json({ books });
	} catch (err) {
		next(err);
	}
});

//get all book details for books in a list by id
router.get("/my-lists/:list_id", async (req, res, next) => {
	try {
		const { list_id } = req.params;
		const books_in_list = await Book.getBooksInList(list_id);
		return res.status(200).json({ books_in_list });
	} catch (err) {
		next(err);
	}
});

//get top seller books
router.get("/top-sellers", async (req, res, next) => {
	try {
		const top_sellers = await Book.getTopSellers();
		return res.status(200).json({ top_sellers });
	} catch (err) {
		next(err);
	}
});

//get top seller by name
router.get("/top-sellers/:title", async (req, res, next) => {
	try {
		const { title } = req.params;
		const top_seller = await Book.getTopSellerInfoByTitle(title);

		return res.status(200).json({ top_seller });
	} catch (err) {
		next(err);
	}
});

module.exports = router;

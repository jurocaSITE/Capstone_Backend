const express = require("express");
const List = require("../models/lists");
const security = require("../middleware/security"); // middleware
const router = express.Router();

//create a list
router.post(
	"/create-new-list",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const new_list = await List.createNewList({
				user,
				new_list_info: req.body,
			});
			return res.status(201).json({ new_list });
		} catch (err) {
			next(err);
		}
	}
);

// get all lists by user id
router.get(
	"/get-all-lists",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const all_lists = await List.getAllListsByUserId(user);
			return res.status(200).json({ all_lists });
		} catch (err) {
			next(err);
		}
	}
);
//edit a list name and cover
//
//delete list
//
// add book to list
router.post(
	"/:list_id/add-book/:book_id",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { list_id } = req.params;
			const { book_id } = req.params;
			const book_added = await List.addBookById({ list_id, book_id });
			return res.status(200).json({ book_added });
		} catch (err) {
			next(err);
		}
	}
);
// delete books from lists
//
//get all books from specific list
router.get(
	"/:list_id/books",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { list_id } = req.params;
			const all_lists = await List.getAllBooksInListByListId(list_id);
			return res.status(200).json({ all_lists });
		} catch (err) {
			next(err);
		}
	}
);

module.exports = router;

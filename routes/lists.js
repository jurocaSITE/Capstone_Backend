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

//get currently reading list by user id
	router.get(
		"/get-currently-reading",
		security.requireAuthenticatedUser,
		async (req, res, next) => {
			try {
				const { user } = res.locals;
				const currently_reading = await List.getCurrentlyReadingListByUserId(user);
				return res.status(200).json({ currently_reading });
			} catch (err) {
				next(err);
			}
		}
	);

// get list name by list id
router.get(
	"/get-list-name/:list_id",
	async (req, res, next) => {
		try {
			const { list_id } = req.params;
			const list_name = await List.getListNameById(list_id);
			return res.status(200).json( list_name );
		} catch (err) {
			next(err);
		}
	}
);
//edit a list name and cover
router.put(
	"/edit/:list_id",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { list_id } = req.params;
			const edit_list = await List.editList({
				list_id,
				new_list_info: req.body,
			});
			return res.status(204).json({ edit_list });
		} catch (err) {
			next(err);
		}
	}
);

//delete list
router.delete(
	"/delete/:list_id",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { list_id } = req.params;
			const deleted_list = await List.deleteList(list_id);
			return res.status(204).json({ deleted_list });
		} catch (err) {
			next(err);
		}
	}
);
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
//CODE HERE

//get list contents from specific list
router.get(
	"/:list_id/books",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { list_id } = req.params;
			const list_contents = await List.getListContents(list_id);
			return res.status(200).json({ list_contents });
		} catch (err) {
			next(err);
		}
	}
);


module.exports = router;

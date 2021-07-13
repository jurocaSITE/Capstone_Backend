const express = require("express");
const List = require("../models/lists");
const { createUserJwt } = require("../utils/tokens"); //utility function to generate json web tokens
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
			return res.status(204).json({ new_list });
		} catch (err) {
			next(err);
		}
	}
);
//
// get all lists by user id
//
//edit a list name
//
//delete list
//
// add book to list
//
// delete books from lists
//
//get book from list
//

module.exports = router;

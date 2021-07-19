const express = require("express");
const router = express.Router();
const Rating = require("../models/rating");
const { requireAuthenticatedUser } = require("../middleware/security"); // middleware

//create a new rating
router.post("/", requireAuthenticatedUser, async (req, res, next) => {
	try {
		const { user } = req.locals;
		const rating = await Rating.createRating({ user, rating: req.body })
		return res.status(200).json({ rating });
	} catch (err) {
		next(err);
	}
});

//list all ratings for a book
router.get("/", async (req, res, next) => {
	try {
		//logic
	} catch (err) {
		next(err);
	}
});

//fetch a single rating
router.get("/:rating_id", async (req, res, next) => {
	try {
		//logic
	} catch (err) {
		next(err);
	}
});

// update a single rating
router.put("/:rating_id", async (req, res, next) => {
	try {
		//logic
	} catch (err) {
		next(err);
	}
});


module.exports = router;

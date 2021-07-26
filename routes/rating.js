const express = require("express");
const router = express.Router();
const Rating = require("../models/rating");
const { requireAuthenticatedUser } = require("../middleware/security"); // middleware
const { authedUserOwnsRating } = require("../middleware/permissions");

// create a new rating
router.post("/:book_id", requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const { book_id } = req.params
    const rating = await Rating.createRating({ user, book_id, rating: req.body });
    return res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
});

// list all ratings for a book
router.get("/book/:book_id", async (req, res, next) => {
  try {
    const { book_id } = req.params;
    const ratings = await Rating.listRatingsForBook(book_id);
    return res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
});

// list all ratings by a user
router.get("/user", requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const ratings = await Rating.listRatingsByUser(user);
    return res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
});

// fetch a single rating
router.get("/:rating_id", async (req, res, next) => {
  try {
    const { rating_id } = req.params;
    const rating = await Rating.fetchRatingById(rating_id);
    return res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
});

// update a single rating
router.patch(
  "/:rating_id",
  requireAuthenticatedUser,
  authedUserOwnsRating,
  async (req, res, next) => {
    try {
      const { rating_id } = req.params;
      const rating = await Rating.editRating({
        rating_id,
        rating_update: req.body,
      });
      return res.status(200).json({ rating });
    } catch (err) {
      next(err);
    }
  }
);

// delete a single rating
router.delete(
  "/:rating_id",
  requireAuthenticatedUser,
  authedUserOwnsRating,
  async (req, res, next) => {
    try {
      const { rating_id } = req.params;
      const rating = await Rating.deleteRating( rating_id );
      return res.status(201).json({ rating });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

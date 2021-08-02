const express = require("express");
const router = express.Router();
const Replies = require("../models/replies");
const { requireAuthenticatedUser } = require("../middleware/security"); // middleware
const {
  authedUserOwnsReply,
  authedUserIsNotRatingOwner,
} = require("../middleware/permissions");

// create a new reply for a rating
router.post(
  "/rating/:rating_id",
  requireAuthenticatedUser,
  authedUserIsNotRatingOwner,
  async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { rating_id } = req.params;
      const reply = await Replies.createReply({
        user,
        rating_id,
        reply: req.body,
      });
      return res.status(201).json({ reply });
    } catch (err) {
      next(err);
    }
  }
);

// list all replies for a rating
router.get("/rating/:rating_id", async (req, res, next) => {
  try {
    const { rating_id } = req.params;
    const replies = await Replies.listRepliesForRating(rating_id);
    return res.status(200).json({ replies });
  } catch (err) {
    next(err);
  }
});

// list all replies by a user
// router.get("/user", requireAuthenticatedUser, async (req, res, next) => {
//   try {
//     const { user } = res.locals;
//     const replies = await Replies.listRepliesByUser(user);
//     return res.status(200).json({ replies });
//   } catch (err) {
//     next(err);
//   }
// });

// fetch a single reply
router.get("/:reply_id", async (req, res, next) => {
  try {
    const { reply_id } = req.params;
    const reply = await Replies.fetchReplyById(reply_id);
    return res.status(200).json({ reply });
  } catch (err) {
    next(err);
  }
});

// update a single reply
router.patch(
  "/:reply_id",
  requireAuthenticatedUser,
  authedUserOwnsReply,
  async (req, res, next) => {
    try {
      const { reply_id } = req.params;
      const reply = await Replies.editReply({
        reply_id,
        reply_update: req.body,
      });
      return res.status(200).json({ reply });
    } catch (err) {
      next(err);
    }
  }
);

// delete a single reply
router.delete(
  "/:reply_id",
  requireAuthenticatedUser,
  authedUserOwnsReply,
  async (req, res, next) => {
    try {
      const { reply_id } = req.params;
      const reply = await Replies.deleteReply(reply_id);
      return res.status(200).json({ reply });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

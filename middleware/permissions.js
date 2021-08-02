const Rating = require("../models/rating")
const Replies = require("../models/replies")
const { BadRequestError, ForbiddenError } = require("../utils/errors")

// ensure authed user is owner of rating
// if not throw error
// else everything is okay
const authedUserOwnsRating = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { rating_id } = req.params
        const rating = await Rating.fetchRatingById(rating_id)

        if (rating.userEmail !== user.email) {
            throw new ForbiddenError(`User is not allowed to update other users' ratings`)
        }

        res.locals.rating = rating // might come in handy
        return next()
    } catch (error) {
        return next(error)
    }
}

const authedUserIsNotRatingOwner = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { rating_id } = req.params
        const rating = await Rating.fetchRatingById(rating_id)

        if (rating.userEmail === user.email) {
            throw new ForbiddenError(`Users are not allowed to reply to their own ratings.`)
        }

        res.locals.rating = rating // might come in handy
        return next()
    } catch (error) {
        return next(error)
    }
}

// ensure authed user is owner of reply
// if not throw error
// else everything is okay
const authedUserOwnsReply = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { reply_id } = req.params
        const reply = await Replies.fetchReplyById(reply_id)

        if (reply.userEmail !== user.email) {
            throw new ForbiddenError(`User is not allowed to update other users' replies`)
        }

        res.locals.reply = reply // might come in handy
        return next()
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    authedUserOwnsRating,
    authedUserIsNotRatingOwner,
    authedUserOwnsReply
}
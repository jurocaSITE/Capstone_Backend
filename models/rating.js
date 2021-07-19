const db = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Rating {
    static async listRatingsForBook(book_id) {
        // fetch all ratings for a single book
    }

    static async listRatingsByUser(user_id) {
        // fetch all ratings created by a user
    }

    static async fetchRatingForBookByUser({ user, book_id }) {
        // fetch a user's rating for a book if it exists

    }

    static async createRating({user, rating }) {
        // check if user has already rated the book
        // and throw an error if they have
        // otherwise insert new rating into db
        const requiredFields = ["rating", "reviewBody", "bookId"]
        requiredFields.forEach(field => {
            if (!rating.hasOwnProperty(field)) {
                throw new BadRequestError(`Required field -- ${field} -- missing from request body`)
            }
        })

        // optional check for char count (aka length) of reviewBody
        // if (rating.reviewBody.length > 500) {
        //     throw new BadRequestError(`Rating caption must be 500 characters or less.`)
        // }

        const res = await db.query(
            `
            INSERT INTO ratings_and_reviews (rating, review_body, book_id, user_id)
            VALUES ($1, $2, $3, (SELECT id FROM users WHERE email = $4))
            RETURNING  id,
                        rating,
                        review_body AS "reviewBody",
                        user_id AS "userId",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
            `, [rating.rating, rating.reviewBody, rating.bookId, user.email]
        )

        return result.rows[0]
    }

    static async editRating({ rating_id, rating_update }) {
        // edit a single rating
    }
}

module.exports = Rating
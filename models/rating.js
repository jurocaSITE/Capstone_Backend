const db = require("../db")

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

    static async createRating({ review, rating, user, book_id }) {
        // check if user has already rated the book
        // and throw an error if they have
        // otherwise insert new rating into db
    }

    static async editRating({ rating_id, rating_update }) {
        // edit a single rating
    }
}

module.exports = Rating
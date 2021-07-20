const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Rating {
  static async listRatingsForBook(book_id) {
    // fetch all ratings for a single book
    const res = await db.query(
      `
            SELECT  rr.id,
                    rr.rating,
                    rr.review_body AS "reviewBody",
                    rr.user_id AS "userId",
                    u.username,
                    u.email AS "userEmail",
                    rr.book_id AS "bookId",
                    rr.created_at AS "createdAt",
                    rr.updated_at AS "updatedAt" 
            FROM ratings_and_reviews AS rr
                JOIN users AS u ON u.id = rr.user_id
            WHERE book_id = $1
            ORDER BY rr.created_at DESC 
        ;`,
      [book_id]
    );

    const ratings = res.rows;
    if (ratings.length < 1) {
      throw new NotFoundError();
    }

    return ratings;
  }

  static async listRatingsByUser(user) {
    // fetch all ratings created by a user
    const res = await db.query(
      `
              SELECT  rr.id,
                      rr.rating,
                      rr.review_body AS "reviewBody",
                      rr.user_id AS "userId",
                      u.username,
                      u.email AS "userEmail",
                      rr.book_id AS "bookId",
                      rr.created_at AS "createdAt",
                      rr.updated_at AS "updatedAt" 
              FROM ratings_and_reviews AS rr
                  JOIN users AS u ON u.id = rr.user_id
              WHERE rr.user_id = (SELECT id FROM users WHERE email = $1)
              ORDER BY rr.created_at DESC 
          ;`,
      [user.email]
    );

    const ratings = res.rows;
    if (ratings.length < 1) {
      throw new NotFoundError();
    }

    return ratings;
  }

  static async fetchRatingForBookByUser({ user, book_id }) {
    // fetch a user's rating for a book if it exists
  }

  static async createRating({ user, rating }) {
    // check if user has already rated the book
    // and throw an error if they have
    // otherwise insert new rating into db
    const requiredFields = ["rating", "reviewBody", "bookId"];
    requiredFields.forEach((field) => {
      if (!rating.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field -- ${field} -- missing from request body`
        );
      }
    });

    // optional check for char count (aka length) of reviewBody
    // if (rating.reviewBody.length > 500) {
    //     throw new BadRequestError(`Rating caption must be 500 characters or less.`)
    // }

    const res = await db.query(
      `
            INSERT INTO ratings_and_reviews (rating, review_body, book_id, user_id)
            VALUES ($1, $2, $3, (SELECT id FROM users WHERE email = $4))
            RETURNING   id,
                        rating,
                        review_body AS "reviewBody",
                        user_id AS "userId",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
            ;`,
      [rating.rating, rating.reviewBody, rating.bookId, user.email]
    );

    return res.rows[0];
  }

  static async fetchRatingById(rating_id) {
    // fetch a single rating
    const res = await db.query(
      `
              SELECT  rr.id,
                      rr.rating,
                      rr.review_body AS "reviewBody",
                      rr.user_id AS "userId",
                      u.username,
                      u.email AS "userEmail",
                      rr.book_id AS "bookId",
                      rr.created_at AS "createdAt",
                      rr.updated_at AS "updatedAt" 
              FROM ratings_and_reviews AS rr
                  JOIN users AS u ON u.id = rr.user_id
              WHERE rr.id = $1
          ;`,
      [rating_id]
    );

    const rating = res.rows[0];
    if (!rating) {
      throw new NotFoundError();
    }

    return rating;
  }

  static async editRating({ rating_id, rating_update }) {
    // edit a single rating
    const requiredFields = ["rating", "reviewBody"];
    requiredFields.forEach((field) => {
      if (!rating_update.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field -- ${field} -- missing from request body`
        );
      }
    });

    const res = await db.query(
        `
            UPDATE ratings_and_reviews 
            SET rating = $1,
                review_body = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING id,
                      rating,
                      review_body AS "reviewBody",
                      user_id AS "userId",
                      created_at AS "createdAt",
                      updated_at AS "updatedAt"
        `, [rating_update.rating, rating_update.reviewBody, rating_id]
    )

    return res.rows[0]
  }
}

module.exports = Rating;

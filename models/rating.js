const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Rating {
  static async listRatingsForBook(book_id) {
    // fetch all ratings for a single book
    const res = await db.query(
      `
            SELECT  rr.id,
                    rr.rating,
                    rr.review_title AS "reviewTitle",
                    rr.review_body AS "reviewBody",
                    rr.user_id AS "userId",
                    u.username,
                    u.email AS "userEmail",
                    rr.book_id AS "bookId",
                    rr.created_at AS "createdAt",
                    rr.updated_at AS "updatedAt" 
            FROM ratings_and_reviews AS rr
                LEFT JOIN users AS u ON u.id = rr.user_id
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
                      rr.review_title AS "reviewTitle",
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
    const res = await db.query(
      `
            SELECT rating, review_title, review_body, user_id, book_id, created_at
            FROM ratings_and_reviews
            WHERE user_id = (SELECT id FROM users WHERE email = $1)
                AND book_id = $2 
        `,
      [user.email, book_id]
    );

    return res.rows[0];
  }

  static async createRating({ user, book_id, rating }) {
    const requiredFields = ["rating", "reviewTitle", "reviewBody"];
    requiredFields.forEach((field) => {
      if (!rating.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field -- ${field} -- missing from request body`
        );
      }
    });

    if (
      !Number(rating.rating) ||
      Number(rating.rating <= 0 || Number(rating.rating) > 5)
    ) {
      throw new BadRequestError(
        `Invalid Rating Provided. Must be a value between 0 and 5, not including 0.`
      );
    }

    if (rating.reviewTitle.length < 1) {
      throw new BadRequestError(
        `Required field -- reviewTitle -- cannot be empty`
      );
    }

    if (rating.reviewBody.length < 1) {
      throw new BadRequestError(
        `Required field -- reviewBody -- cannot be empty`
      );
    }

    // check if user has already rated the book
    // and throw an error if they have
    const existingRating = await Rating.fetchRatingForBookByUser({
      user,
      book_id,
    });
    if (existingRating) {
      throw new BadRequestError(
        `Users aren't allowed to leave multiple reviews for a single book.`
      );
    }

    // optional check for char count (aka length) of reviewBody
    // if (rating.reviewBody.length > 500) {
    //     throw new BadRequestError(`Rating caption must be 500 characters or less.`)
    // }

    const res = await db.query(
      `
            INSERT INTO ratings_and_reviews (rating, review_title, review_body, book_id, user_id)
            VALUES ($1, $2, $3, $4, (SELECT id FROM users WHERE email = $5))
            RETURNING   id,
                        rating,
                        review_title AS "reviewTitle",
                        review_body AS "reviewBody",
                        user_id AS "userId",
                        book_id AS "bookId",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
            ;`,
      [
        rating.rating,
        rating.reviewTitle,
        rating.reviewBody,
        book_id,
        user.email,
      ]
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
                      rr.review_title AS "reviewTitle",
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

    // error handling
    const requiredFields = ["rating", "reviewTitle", "reviewBody"];
    requiredFields.forEach((field) => {
      if (!rating_update.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field -- ${field} -- missing from request body`
        );
      }
    });

    if (
      !Number(rating_update.rating) ||
      Number(rating_update.rating <= 0 || Number(rating_update.rating) > 5)
    ) {
      throw new BadRequestError(
        `Invalid Rating Provided. Must be a value between 0 and 5, not including 0.`
      );
    }

    if (rating_update.reviewTitle.length < 1) {
      throw new BadRequestError(
        `Required field -- reviewTitle -- cannot be empty`
      );
    }

    if (rating_update.reviewBody.length < 1) {
      throw new BadRequestError(
        `Required field -- reviewBody -- cannot be empty`
      );
    }

    // query db
    const res = await db.query(
      `
            UPDATE ratings_and_reviews 
            SET rating = $1,
                review_title = $2,
                review_body = $3,
                updated_at = NOW()
            WHERE id = $4
            RETURNING id,
                      rating,
                      review_title AS "reviewTitle",
                      review_body AS "reviewBody",
                      user_id AS "userId",
                      book_id AS "bookId",
                      created_at AS "createdAt",
                      updated_at AS "updatedAt"
        `,
      [
        rating_update.rating,
        rating_update.reviewTitle,
        rating_update.reviewBody,
        rating_id,
      ]
    );

    return res.rows[0];
  }

  static async deleteRating(rating_id) {
    // delete a single rating

    const res = await db.query(
      `
        DELETE FROM ratings_and_reviews
        WHERE id = $1
        RETURNING id,
                  rating,
                  review_title AS "reviewTitle",
                  review_body AS "reviewBody",
                  user_id AS "userId",
                  book_id AS "bookId",
                  created_at AS "createdAt",
                  updated_at AS "updatedAt"
      `, [rating_id]
    )

    return res.rows[0]
  }
}

module.exports = Rating;

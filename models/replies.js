const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Replies {
  static async listRepliesForRating(rating_id) {
    // fetch all replies for a single rating
    const res = await db.query(
      `
            SELECT  rr.id,
                    rr.reply_body AS "replyBody",
                    rr.rating_id AS "ratingId",
                    rr.user_id AS "userId",
                    u.username,
                    u.email AS "userEmail",
                    rr.created_at AS "createdAt",
                    rr.updated_at AS "updatedAt" 
            FROM reviews_replies AS rr
                LEFT JOIN users AS u ON u.id = rr.user_id
            WHERE rating_id = $1
            ORDER BY rr.created_at DESC 
        ;`,
      [rating_id]
    );

    const replies = res.rows;
    if (replies.length < 1) {
      throw new NotFoundError();
    }

    return replies;
  }

  static async listRepliesByUser() {
    // fetch all replies ever written by a user
  }

  static async listRepliesForRatingByUser() {
    // fetch all replies by a user for a single rating
  }

  static async fetchReplyById(reply_id) {
    // fetch a single reply
    const res = await db.query(
      `
              SELECT  rr.id,
                      rr.reply_body AS "replyBody",
                      rr.rating_id AS "ratingId",
                      rr.user_id AS "userId",
                      u.username,
                      u.email AS "userEmail",
                      rr.created_at AS "createdAt",
                      rr.updated_at AS "updatedAt" 
              FROM reviews_replies AS rr
                  JOIN users AS u ON u.id = rr.user_id
              WHERE rr.id = $1
          ;`,
      [reply_id]
    );

    const reply = res.rows[0];
    if (!reply) {
      throw new NotFoundError();
    }

    return reply;
  }

  static async createReply({ user, rating_id, reply }) {
    const requiredFields = ["replyBody"];
    requiredFields.forEach((field) => {
      if (!reply.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field -- ${field} -- missing from request body`
        );
      }
    });

    if (reply.replyBody.length < 1) {
      throw new BadRequestError(
        `Required field -- replyBody -- cannot be empty`
      );
    }

    // optional check for char count (aka length) of replyBody
    // if (reply.reviewBody.length > 500) {
    //     throw new BadRequestError(`Reply body must be 500 characters or less.`)
    // }

    const res = await db.query(
      `
            INSERT INTO reviews_replies (user_id, rating_id, reply_body)
            VALUES ((SELECT id FROM users WHERE email = $1), $2, $3)
            RETURNING   id,
                        reply_body AS "replyBody",
                        user_id AS "userId",
                        rating_id AS "ratingId",
                        (SELECT username FROM users WHERE email = $1) AS "username",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
            ;`,
      [user.email, rating_id, reply.replyBody]
    );

    return res.rows[0];
  }

  static async editReply({user, reply_id, reply_update }) {
    // edit a single rating

    // error handling
    const requiredFields = ["replyBody"];
    requiredFields.forEach((field) => {
      if (!reply_update.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field -- ${field} -- missing from request body`
        );
      }
    });

    if (reply_update.replyBody.length < 1) {
      throw new BadRequestError(
        `Required field -- replyBody -- cannot be empty`
      );
    }

    // query db
    const res = await db.query(
      `
            UPDATE reviews_replies
            SET reply_body = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING id,
                      reply_body AS "replyBody",
                      rating_id AS "ratingId",
                      user_id AS "userId",
                      (SELECT username FROM users WHERE email = $3) AS "username",
                      created_at AS "createdAt",
                      updated_at AS "updatedAt"
        `,
      [
        reply_update.replyBody,
        reply_id, 
        user.email
      ]
    );

    return res.rows[0];
  }

  static async deleteReply(reply_id) {
    // delete a single reply

    const res = await db.query(
      `
        DELETE FROM reviews_replies
        WHERE id = $1
        RETURNING id,
                  reply_body AS "replyBody",
                  rating_id AS "ratingId",
                  user_id AS "userId",
                  created_at AS "createdAt",
                  updated_at AS "updatedAt"
      `, [reply_id]
    )

    return res.rows[0]
  }
}

module.exports = Replies;

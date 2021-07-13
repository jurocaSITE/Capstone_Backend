const bcrypt = require("bcrypt");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { BCRYPT_WORK_FACTOR } = require("../config");

class List {
	static async createNewList({ user, new_list_info }) {
		const requiredFields = ["list_name", "image"];
		requiredFields.forEach((field) => {
			if (!new_list_info.hasOwnProperty(field)) {
				throw new BadRequestError(
					`Required field -${field} - missing from request body.`
				);
			}
		});

		const userId = await db.query(`SELECT id FROM users WHERE email = $1`, [
			user.email,
		]);

		const results = await db.query(
			`INSERT INTO lists (list_name, user_id, image ) VALUES ($1, $2, $3) RETURNING list_name, user_id, image;
			`,
			[new_list_info.list_name, userId.rows[0].id, new_list_info.image]
		);

		return results.rows[0];
	}
}

module.exports = List;

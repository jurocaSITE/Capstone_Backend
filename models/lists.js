const bcrypt = require("bcrypt");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { BCRYPT_WORK_FACTOR } = require("../config");

class List {
	// create new list
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

	//get all list by user id
	static async getAllListsByUserId(user) {
		const userId = await db.query(`SELECT id FROM users WHERE email = $1`, [
			user.email,
		]);

		const result = await db.query(`SELECT * FROM lists WHERE user_id = $1`, [
			userId.rows[0].id,
		]);

		return result.rows;
	}


	// add book by book id to list by list id
	static async addBookById({ list_id, book_id }) {
		const results = await db.query(
			`INSERT INTO list_contents (list_id, book_id) VALUES ($1, $2) RETURNING list_id, book_id;
			`,
			[list_id, book_id]
		);

		return results.rows[0];
	}

	// remove book by book id to list by list id
	// static async removeBookById({ list_id, book_id }) {
	// 	const results = await db.query(
	// 		`DELETE FROM list_contents WHERE book_id=$1`, 
	// 		[user.book_id]
	// 	);

	// 	return results.rows[0];
	// }

	// get list contents of specific list
	static async getListContents(list_id) {
		const result = await db.query(
			`SELECT * FROM list_contents WHERE list_id = $1`,
			[list_id]
		);

		return result.rows;
	}

	// get list name by list contents id
	static async getListNameById(list_id) {
		const result = await db.query(
			`SELECT list_name FROM lists WHERE id = $1`,
			[list_id]
		);

		return result.rows[0];
	}

}

module.exports = List;

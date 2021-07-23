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

		//checking fields are not empty
		if (new_list_info.list_name.length === 0) {
			throw new BadRequestError("Missing list name.");
		}
		if (new_list_info.image.length === 0) {
			throw new BadRequestError("Missing image URL.");
		}

		const userId = await db.query(`SELECT id FROM users WHERE email = $1`, [
			user.email,
		]);

		const results = await db.query(
			`INSERT INTO lists (list_name, user_id, image ) VALUES ($1, $2, $3) RETURNING id, list_name, user_id, image;
			`,
			[new_list_info.list_name, userId.rows[0].id, new_list_info.image]
		);

		return results.rows[0];
	}

	//edit existing list
	static async editList({ list_id, new_list_info }) {
		// checking field exists in req.body
		const requiredFields = ["list_name", "image"];
		requiredFields.forEach((field) => {
			if (!new_list_info.hasOwnProperty(field)) {
				throw new BadRequestError(
					`Required field -${field} - missing from request body.`
				);
			}
		});

		//checking fields are not empty
		if (new_list_info.list_name.length === 0) {
			throw new BadRequestError("Missing list name.");
		}
		if (new_list_info.image.length === 0) {
			throw new BadRequestError("Missing image URL.");
		}

		// updating database
		const results = await db.query(
			`
				UPDATE lists
				SET list_name = $1, 
					image = $2
				WHERE id = $3
				RETURNING list_name, image;
			`,
			[new_list_info.list_name, new_list_info.image, list_id]
		);

		return results.rows[0];
	}

	//get all list by user id
	static async getAllListsByUserId(user) {
		const userId = await db.query(`SELECT id FROM users WHERE email = $1`, [
			user.email,
		]);

		const result = await db.query(
			`SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at ASC`,
			[userId.rows[0].id]
		);

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

	// get all books in specific list
	static async getAllBooksInListByListId(list_id) {
		const result = await db.query(
			`SELECT * FROM list_contents WHERE list_id = $1`,
			[list_id]
		);

		return result.rows;
	}

	// delete existing list
	static async deleteList(list_id) {
		const results = await db.query(
			`
			DELETE FROM lists
			WHERE id = $1
			RETURNING (id, list_name, image);
			`,
			[list_id]
		);
	}
}

module.exports = List;

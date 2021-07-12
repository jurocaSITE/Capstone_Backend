const bcrypt = require("bcrypt");
const db = require("../db");
const { BadRequestError } = require("../utils/errors");
const fetch = require("node-fetch");
// process.env.NYT_API_KEY --> to get the API Key from the .env file

class Book {
	//get alll book siwth specific key word
	static async getAllBooksByyKeyword(key_word) {
		let get_book_by_name_url = `https://www.googleapis.com/books/v1/volumes?q=${key_word}`;
		console.log(get_book_by_name_url); //TODO: delete comment

		const response = await fetch(get_book_by_name_url);
		const responseData = await response.json();

		let booksReturned = [responseData.items.length];

		for (let i = 0; i < responseData.items.length; i++) {
			booksReturned[i] = {
				selfLink: responseData.items[i].selfLink,
				id: responseData.items[i].id,
				title: responseData.items[i].volumeInfo.title,
				authors: responseData.items[i].volumeInfo.authors,
				publishedDate: responseData.items[i].volumeInfo.publishedDate,
				description: responseData.items[i].volumeInfo.description,
				pageCount: responseData.items[i].volumeInfo.pageCount,
				categories: responseData.items[i].volumeInfo.categories,
				maturityRating: responseData.items[i].volumeInfo.maturityRating,
				imageLinks: responseData.items[i].volumeInfo.imageLinks,
			};
		}

		console.log(booksReturned);

		return booksReturned;
	}

	// get book by id
	static async getBookById(book_id) {
		let get_book_by_name_url = `https://www.googleapis.com/books/v1/volumes/${book_id}`;

		const response = await fetch(get_book_by_name_url);
		const responseData = await response.json();

		return {
			selfLink: responseData.selfLink,
			id: responseData.id,
			title: responseData.volumeInfo.title,
			authors: responseData.volumeInfo.authors,
			publishedDate: responseData.volumeInfo.publishedDate,
			description: responseData.volumeInfo.description,
			pageCount: responseData.volumeInfo.pageCount,
			categories: responseData.volumeInfo.categories,
			maturityRating: responseData.volumeInfo.maturityRating,
			imageLinks: responseData.volumeInfo.imageLinks,
		};
	}
}

module.exports = Book;

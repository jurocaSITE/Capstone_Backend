const db = require("../db");
const fetch = require("node-fetch");

class Book {
	//get alll book siwth specific key word
	static async getAllBooksByKeyword(key_word) {
		let get_book_by_name_url = `https://www.googleapis.com/books/v1/volumes?q=${key_word}`;

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
				isbn: responseData.items[0].volumeInfo.industryIdentifiers[0]
					.identifier,
			};
		}

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

	//get top seller books
	static async getTopSellers() {
		const get_top_sellers_url = `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${process.env.NYT_API_KEY}`;

		const response = await fetch(get_top_sellers_url);
		const responseData = await response.json();

		let top_books = [responseData.results.lists[0].books.length];

		console.log(responseData.results.lists[0].books[0].title);
		console.log(responseData.results.lists[0].books[0].primary_isbn13);

		for (let i = 0; i < responseData.results.lists[0].books.length; i++) {
			let book = await Book.getBookFromGoogleAPI(
				responseData.results.lists[0].books[i].title,
				responseData.results.lists[0].books[i].primary_isbn13
			);

			top_books[i] = book;
		}

		return top_books;
	}

	//get book from google api by passing the title and isbn from NYT api
	static async getBookFromGoogleAPI(title, isbn) {
		//gettiing the array of books from google api that matched the title that was passed
		const top_sellers = await Book.getAllBooksByKeyword(title);

		// variable that will hold the book we want
		let top_seller = {};

		// loop through the top_sellers array and find the book from goolge api that maches with the name and title of the top seller book from NYT api
		for (let i = 0; i < top_sellers.length; i++) {
			if (isbn === top_sellers[i].isbn && title === top_sellers[i].title) {
				top_seller = top_sellers[i];
				i = top_sellers.length;
			}
		}

		return top_seller;
	}

	// get top seller info from google api by title
	static async getTopSellerInfoByTitle(title) {
		const top_sellers = await Book.getAllBooksByKeyword(title);

		return top_sellers[0];
	}
}

module.exports = Book;

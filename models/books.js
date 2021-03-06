const db = require("../db");
const fetch = require("node-fetch");

class Book {
  //get all books with a specific key word
  static async getAllBooksByKeyword(key_word, offset = 0) {
    let get_book_by_name_url = `https://www.googleapis.com/books/v1/volumes?q=${key_word}&orderBy=relevance&startIndex=${offset}`;

    const response = await fetch(get_book_by_name_url);
    const responseData = await response.json();

    let booksReturned = [responseData.items.length];
    for (let i = 0; i < responseData.items.length; i++) {
      // query the SQL database for every book returned by the google API
      // to get the ratings
      const dbResponse = await db.query(
        `
        SELECT  AVG(rating) AS "averageRating",
                COUNT(rating) AS "totalRatings"
        FROM ratings_and_reviews
        GROUP BY book_id
        HAVING book_id = $1
        ;`,
        [responseData.items[i].id]
      );

      booksReturned[i] = {
        selfLink: responseData.items[i].selfLink,
        id: responseData.items[i].id,
        title: responseData.items[i].volumeInfo.title,
        authors: responseData.items[i].volumeInfo.authors,
        publishedDate: responseData.items[i].volumeInfo.publishedDate,
        description: responseData.items[i].volumeInfo.description,
        averageRating: dbResponse?.rows[0]?.averageRating,
        totalRatings: dbResponse?.rows[0]?.totalRatings,
        pageCount: responseData.items[i].volumeInfo.pageCount,
        categories: responseData.items[i].volumeInfo.categories,
        maturityRating: responseData.items[i].volumeInfo.maturityRating,
        imageLinks: responseData.items[i].volumeInfo.imageLinks,
      };
    }
    return booksReturned;
  }

  // get book by id
  static async getBookById(book_id) {
    let get_book_by_name_url = `https://www.googleapis.com/books/v1/volumes/${book_id}`;

    const response = await fetch(get_book_by_name_url);
    const responseData = await response.json();

    const dbResponse = await db.query(
      `
      SELECT  AVG(rating) AS "averageRating",
              COUNT(rating) AS "totalRatings"
      FROM ratings_and_reviews
      GROUP BY book_id
      HAVING book_id = $1
      ;`,
      [responseData.id]
    );

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
      averageRating: dbResponse?.rows[0]?.averageRating,
      totalRatings: dbResponse?.rows[0]?.totalRatings,
      imageLinks: responseData.volumeInfo.imageLinks,
    };
  }

  // get books by author
  static async getBooksByAuthor(author_name) {
    let get_books_by_name_url = `https://www.googleapis.com/books/v1/volumes?q=""+inauthor:${author_name}`;

    const response = await fetch(get_books_by_name_url);
    const responseData = await response.json();
	console.log("books by author...", responseData)

    let booksReturned = [responseData.items.length];
    for (let i = 0; i < responseData.items.length; i++) {
      // query the SQL database for every book returned by the google API
      // to get the ratings
      const dbResponse = await db.query(
        `
        SELECT  AVG(rating) AS "averageRating",
                COUNT(rating) AS "totalRatings"
        FROM ratings_and_reviews
        GROUP BY book_id
        HAVING book_id = $1
        ;`,
        [responseData.items[i].id]
      );

      booksReturned[i] = {
        selfLink: responseData.items[i].selfLink,
        id: responseData.items[i].id,
        title: responseData.items[i].volumeInfo.title,
        authors: responseData.items[i].volumeInfo.authors,
        publishedDate: responseData.items[i].volumeInfo.publishedDate,
        description: responseData.items[i].volumeInfo.description,
        averageRating: dbResponse?.rows[0]?.averageRating,
        totalRatings: dbResponse?.rows[0]?.totalRatings,
        pageCount: responseData.items[i].volumeInfo.pageCount,
        categories: responseData.items[i].volumeInfo.categories,
        maturityRating: responseData.items[i].volumeInfo.maturityRating,
        imageLinks: responseData.items[i].volumeInfo.imageLinks,
      };
    }
    return booksReturned;
  }

  // get all book details for books in a list by id
  static async getBooksInList(list_id) {
    const result = await db.query(
      `SELECT book_id FROM list_contents WHERE list_id = $1`,
      [list_id]
    );
    const results = result.rows;
    let bookList = [result.rows.length];

    for (let i = 0; i < result.rows.length; i++) {
      let book_id = results[i].book_id;
      let get_book_by_name_url = `https://www.googleapis.com/books/v1/volumes/${book_id}`;

      const response = await fetch(get_book_by_name_url);
      const responseData = await response.json();
      const dbResponse = await db.query(
        `
        SELECT  AVG(rating) AS "averageRating",
                COUNT(rating) AS "totalRatings"
        FROM ratings_and_reviews
        GROUP BY book_id
        HAVING book_id = $1
        ;`,
        [responseData.id]
      );

      bookList[i] = {
        id: responseData.id,
        title: responseData.volumeInfo.title,
        authors: responseData.volumeInfo.authors,
        pageCount: responseData.volumeInfo.pageCount,
        categories: responseData.volumeInfo.categories,
        imageLinks: responseData.volumeInfo.imageLinks,
        averageRating: dbResponse?.rows[0]?.averageRating,
        totalRatings: dbResponse?.rows[0]?.totalRatings,
      };
    }
    return bookList;
  }

  //get top seller books
  static async getTopSellers() {
    const get_top_sellers_url = `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${process.env.NYT_API_KEY}`;

    const response = await fetch(get_top_sellers_url);
    const responseData = await response.json();

    let top_books = [responseData.results.lists[0].books.length];
    for (let i = 0; i < responseData.results.lists[0].books.length; i++) {
      top_books[i] = {
        author: responseData.results.lists[0].books[i].author,
        book_image: responseData.results.lists[0].books[i].book_image,
        book_image_width:
          responseData.results.lists[0].books[i].book_image_width,
        book_image_height:
          responseData.results.lists[0].books[i].book_image_height,
        description: responseData.results.lists[0].books[i].description,
        publisher: responseData.results.lists[0].books[i].publisher,
        title: responseData.results.lists[0].books[i].title,
        buy_links: responseData.results.lists[0].books[i].buy_links,
      };
    }

    return top_books;
  }

  // get top seller by name
  static async getTopSellerInfoByTitle(title) {
    const top_sellers = await Book.getTopSellers();

    let top_seller = {};

    for (let i = 0; i < top_sellers.length; i++) {
      if (top_sellers[i].title === title) {
        top_seller = top_sellers[i];
      }
    }

    return top_seller;
  }
}

module.exports = Book;

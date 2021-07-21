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
    return booksReturned;
  }

  // get book by id
  static async getBookById(book_id) {
    let get_book_by_name_url = `https://www.googleapis.com/books/v1/volumes/${book_id}`;

    const response = await fetch(get_book_by_name_url);
    const responseData = await response.json();

    const dbResponse = await db.query(
      `
      SELECT  AVG(rr.rating) AS "averageRating",
              COUNT(rr.rating) AS "totalRatings"
      FROM ratings_and_reviews AS rr
      WHERE book_id = $1
      GROUP BY rr.id
      `, [responseData.id]
    )

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

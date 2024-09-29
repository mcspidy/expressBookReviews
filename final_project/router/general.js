const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => {
  // book list
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

const getISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    let isbnNo = parseInt(isbn);
    if (books[isbnNo]) {
      resolve(books[isbnNo]);
    } else {
      reject({ status: 404, message: 'ISBN ${isbn} not found!' })
    }
  });
};

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))    //Task 1
  //return res.status(300).json({message: "Get Books yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    getISBN(req.params.isbn)    //Task 2
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
  );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;   //Task3
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

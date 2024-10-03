const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios");

const getBooks = () => {
  // book list
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.post("/register", (req,res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;
    
    if (password && username) {
      // Check if the user does not already exist
      if (isValid(username)) {
        // Add the new user to the users array
        users.push({ username: username, password: password });
        res.status(200).json("Registration complete!Now you can login");
      } else {
        res.status(404).json({ message: "Unable to register user" });
      }
    } else {
      res.status(400).json({ message: "Username and password are required"});
    }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    //Write your code here
    const books = await getBooks();
    res.send(JSON.stringify(books,null,4))    //Task 1
    //return res.status(300).json({message: "Get Books yet to be implemented"});
});

const getISBN = (isbn) => 
  Promise.resolve(books[isbn]);
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const book = await getISBN(isbn);
    if (book) {
      res.status(200).send(book);
    } else {
      res.status(404).send("No books found by ISNB ${isbn}!")
    }
 });

 const getBookAuthor = (author) =>
  Promise.resolve(Object.values(books).filter(book => book.author === author));
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;   //Task 3
    const bookAuthor = await getBookAuthor(author);
    if (bookAuthor.length > 0) {
      res.status(200).send(bookAuthor)
    } else {
      res.status(404).semd("Book author not found.")
    }
});

const getBookTitle = (title) =>
  Promise.resolve(Object.values(books).filter(book => book.title === title));
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const title = req.params.title; //Task 4
    const bookTitle = await getBookTitle(title);
    if (bookTitle.length > 0) {
      res.status(200).send(bookTitle)
    } else {
      res.status(404).semd("Book Title not found.")
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;   //Task 5
    getISBN(req.params.isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
  );
});

module.exports.general = public_users;

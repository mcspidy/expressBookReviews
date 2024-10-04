const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [] ;

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let userMatches = users.filter((user) => {
        return user.username === username;
    });
    
    if (userMatches.length > 0) {
        return false;
    } else {
        return true;
    }
    
    //return userMatches.length > 0;
};

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return user.username === username && user.password === password;
      });
      if (validUsers.length > 0) {
        return true;
      } else {
        return false;
      }
      //returns boolean
      //check if username and password match the one we have in records.
    };

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username; //Task 7
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({data:password}, "access", {expiresIn: 60 * 60});
        req.session.authorization = {accessToken,username};
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const { review } = req.body;
    let token = req.session.authorization.accessToken;
    
    let dcdr = jwt.verify(token, 'access');
    const username = dcdr.username;

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).send("Review posted");
    } else {
        return res.status(404).send("IBSN ${isbn} not found");
    }
});

//Delete  a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    let token = req.session.authorization.accessToken;

    let dcdr = jwt.verify(token, 'access');
    const username = dcdr.username;

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.send("Review deleted");
    } else {
        return res.send("Review not found");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

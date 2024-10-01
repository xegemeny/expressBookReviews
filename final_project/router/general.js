const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const existingUser = Object.values(users).find(user => user.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists." }); // 409 Conflict
    }


    const newUser = {
        username: username,
        password: password 
    };

    const userId = Object.keys(users).length + 1; 
    users[userId] = newUser; 

    res.status(201).json({ message: "User registered successfully." }); 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; 
    const book = books[isbn]; 

    if (book) {
        res.status(200).json(book); 
    } else {
        res.status(404).json({ message: "Book not found" }); 
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author; 
    const booksByAuthor = [];

    Object.values(books).forEach(book => {
        if (book.author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(book);
        }
    });

    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "Book not found(author)" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; 
    const booksByTitle = [];

    Object.values(books).forEach(book => {
        if (book.title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(book);
        }
    });

    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "Book not found(title)" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; 
    const book = books[isbn]; 


    if (book) {
        res.status(200).json(book.reviews); 
    } else {
        res.status(404).json({ message: "Book not found" }); 
    }
});
// Get the book list available in the shop (with Promise)
public_users.get('/promise/', function (req, res) {

    let getAvailableBooks = new Promise((resolve, reject) => {
      setTimeout(() => {
        res.send(JSON.stringify(books, null, 4));
        resolve("Book list is ready");
      }, 5000);
    });
  
    console.log("Book list is being prepared");
  
    getAvailableBooks.then(message => {
      console.log("From callback: " + message);
    });
  
  });
  
  // Get book details based on ISBN (with Promise)
  public_users.get('/promise/isbn/:isbn', function (req, res) {
  
    let getBookInfo = new Promise((resolve, reject) => {
      setTimeout(() => {
        const isbn = req.params.isbn;
        res.send(books[isbn])
        resolve("Book information is ready");
      }, 5000);
    });
  
    console.log("Book information is being retrieved");
  
    getBookInfo.then(message => {
      console.log("From callback: " + message);
    });
  
  });
  
  // Get book details based on author (with Promise)
  public_users.get('/promise/author/:author', function (req, res) {
  
    let getBookInfoBasedOnAuthor = new Promise((resolve, reject) => {
      setTimeout(() => {
        const author = req.params.author;
        var bookInfoBasedOnAuthor = [];
  
        for (var key in books) {
          if (books[key]["author"] === author) {
            bookInfoBasedOnAuthor.push({
              "isbn":    key,
              "title":   books[key]["title"],
              "reviews": books[key]["reviews"]
            });
          }
        }
  
        res.send(JSON.stringify(bookInfoBasedOnAuthor, null, 4));
        resolve("Book information is ready");
      }, 5000);
    });
  
    console.log("Book information is being retrieved");
  
    getBookInfoBasedOnAuthor.then(message => {
      console.log("From callback: " + message);
    });
  
  });
  
  // Get all books based on title (with Promise)
  public_users.get('/promise/title/:title', function (req, res) {
  
    let getBookInfoBasedOnTitle = new Promise((resolve, reject) => {
      setTimeout(() => {
        const title = req.params.title;
        var bookInfoBasedOnTitle = [];
  
        for (var key in books) {
          if (books[key]["title"] === title) {
            // console.log(JSON.stringify(books[key]));
            bookInfoBasedOnTitle.push({
              "isbn":    key,
              "author":  books[key]["author"],
              "reviews": books[key]["reviews"]
            });
          }
        }
  
        res.send(JSON.stringify(bookInfoBasedOnTitle, null, 4));
        resolve("Book information is ready");
      }, 5000);
    });
  
    console.log("Book information is being retrieved");
  
    getBookInfoBasedOnTitle.then(message => {
      console.log("From callback: " + message);
    });
  });

module.exports.general = public_users;

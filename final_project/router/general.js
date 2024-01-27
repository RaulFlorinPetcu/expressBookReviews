const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBooks() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      },10000);
    });
};

function getBookByISBN(isbn) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books[isbn]);
      },10000);
    });
};

function getBookByAuthor(author) {
    return new Promise((resolve) => {
        const booksArray = Object.entries(books)
        const validBooks = [];

        for (const [key, value] of booksArray) {
            if(value.author === author) {
                validBooks.push(books[key])
            }
        }
        setTimeout(() => {
          resolve(validBooks);
        },10000);
      });
};
function getBookByTitle(title) {
    return new Promise((resolve) => {
        const booksArray = Object.entries(books)
        const validBooks = [];

        for (const [key, value] of booksArray) {
            if(value.title === title) {
                validBooks.push(books[key])
            }
        }
        setTimeout(() => {
          resolve(validBooks);
        },10000);
      });
};



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here

    const fetchedBooks = await getBooks()

    return res.send(JSON.stringify(fetchedBooks));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    if(!isbn || isbn === ":isbn") {
        return res.status(400).send("ISBN is not valid")
    };

    const foundBook = await getBookByISBN(isbn);

    return res.send(foundBook);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    const searchedAuthor = req.params.author;
    if(!searchedAuthor || searchedAuthor.trim() === "" || searchedAuthor === ":author") {
        return res.status(400).send("Author is not valid")
    }
    const fetchedBooks = await getBookByAuthor(searchedAuthor);
    return res.send(fetchedBooks);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
    const searchedTitle = req.params.title;
    if(!searchedTitle || searchedTitle.trim() === "" || searchedTitle === ":title") {
        return res.status(400).send("Title is not valid")
    }
    
    const fetchedBooks = await getBookByTitle(searchedTitle);

    return res.send(fetchedBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn
    if(!isbn || isbn === ":isbn") {
        return res.status(400).send("ISBN is not valid")
    }
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;

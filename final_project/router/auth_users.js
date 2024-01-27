const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    const foundUser = users.filter((user) => {
        if(username === user.username) {
            return true
        }
    })[0];

    if(foundUser) {
        return true;
    }
    else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    const foundUser = users.filter((user) => user.username === username)[0];
    if(foundUser && foundUser.password === password) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
                data: password
            }, 
            'access', 
            { expiresIn: 60 * 60 }
            );
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
    const review = req.body.review;
    const currentUser = req.user.data;
    if(!isbn || isbn === ":isbn") {
        return res.status(400).send("ISBN is not valid")
    }
    else if(!review || review.trim() === "") {
        return res.status(400).send("Review is not valid")
    }

    books[isbn].reviews[currentUser] = review;

    return res.send("Review added/updated successfuly");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const currentUser = req.user.data;
    if(!isbn || isbn === ":isbn") {
        return res.status(400).send("ISBN is not valid")
    }

    delete books[isbn].reviews[currentUser];

    return res.send("Review deleted successfuly");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

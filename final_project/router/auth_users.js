const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in. Please provide username and passowrd."});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({data: password}, 
            'access', { expiresIn: 60 * 60 });

        req.session.authorization = { accessToken, username }

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

    return res.status(500).json({message: "This should not be here."});
});

//logout
regd_users.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(400).send('Unable to log out')
            } else {
                return res.send('Logout successful')
            }
        });
    } else {
        res.end()
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const username = req.session.authorization['username'];
    const isbn = req.params.isbn;

    let book = books[isbn];
    if (book) { //Check is book exists
        //username as key
        let review = {[username]: req.body.review};

        Object.assign(book['reviews'], review);

        books[isbn]=book;
        return res.status(200).send(`Reviews of book ${isbn} updated.\n${JSON.stringify(books[isbn],null,4)}`);
    }
    else{
        return res.status(404).send(`Unable to find book ${isbn}!`);
    }
    //return res.status(300).json({message: "Yet to be implemented"});
    return res.status(500).json({message: "This should not be here."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    if (books[isbn]) { //Check is book exists
        delete books[isbn]["reviews"][username]
        return res.status(200).send(`Review from ${username} with ISBN ${isbn} deleted.\n${JSON.stringify(books[isbn],null,4)}`);

    }else{
        return res.status(404).send(`Unable to find book ${isbn}!`);
    }

    return res.status(500).json({message: "This should not be here."});


    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

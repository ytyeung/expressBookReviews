const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    }else{
        return res.status(404).json({message: "Unable to register user. Please provide both username and password."});
    }

    return res.status(500).json({message: "This should not be here."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    return res.status(200).send(JSON.stringify(books,null,4));
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    if (books[isbn]){
        return res.status(200).send(JSON.stringify(books[isbn],null,4));
    }else{
        return res.status(404).json({message: "ISBN not found."});
    }

    return res.status(500).json({message: "This should not be here."});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let target_book = Object.entries(books).filter(([key, value])=>{
        return value.author === req.params.author;
    });

    target_book = Object.fromEntries(target_book)

    if (Object.keys(target_book).length !== 0){
        return res.status(200).send(JSON.stringify(target_book,null,4));
    }else{
        return res.status(404).json({message: "Author not found."});
    }

    return res.status(500).json({message: "This should not be here."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let target_book = Object.entries(books).filter(([key, value])=>{
        return value.title === req.params.title;
    });

    target_book = Object.fromEntries(target_book)

    if (Object.keys(target_book).length !== 0){
        return res.status(200).send(JSON.stringify(target_book,null,4));
    }else{
        return res.status(404).json({message: "Title not found."});
    }

    return res.status(500).json({message: "This should not be here."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    if (books[isbn]){
        return res.status(200).send(JSON.stringify(books[isbn],null,4));
    }else{
        return res.status(404).json({message: "ISBN not found."});
    }

    return res.status(500).json({message: "This should not be here."});
  
});

module.exports.general = public_users;

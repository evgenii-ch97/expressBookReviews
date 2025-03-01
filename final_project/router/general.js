const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a valid username and password' });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    users.push({ username, password });
    return res.status(200).json({ message: 'User registered successfully' });
});

public_users.get('/', async (req, res) => {
    return res.status(200).json({ books });
});

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const book = Object.values(books).find(b => b.isbn === isbn);
        book ? resolve(book) : reject('Book not found');
    });
}

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

public_users.get('/author/:author', (req, res) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === req.params.author);
    
    if (booksByAuthor.length) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: 'No books found for this author' });
    }
});

public_users.get('/title/:title', (req, res) => {
    const booksByTitle = Object.values(books).filter(book => book.title === req.params.title);
    
    if (booksByTitle.length) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: 'No books found for this title' });
    }
});

public_users.get('/review/:isbn', (req, res) => {
    const book = Object.values(books).find(book => book.isbn === req.params.isbn);
    
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;

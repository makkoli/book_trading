var Book = require('../models/book-model');

// Get a books details
exports.getBookDetails = function(req, res) {
    var query = { bookId: req.params.bookId };

    // Retrieve a chunk of books to display on home page
    Book.findOne(query, function(err, doc) {
        if (err) throw err;

        var bookDetails = {
            bookId: doc.bookId,
            title: doc.title,
            author: doc.author,
            coverPath: doc.cover
        };

        res.render('book_details', {
            logged: res.locals.logged,
            user: res.locals.user,
            book: bookDetails,
            // checks if the user owns the book to display propose button
            userOwnsBook: res.locals.user === doc.user
        });
    });
};

// Propose a trade of books between users
exports.proposeBookTrade = function(req, res) {
    if (res.locals.logged) {
        var query = { user: res.locals.user };

        // Retrieve all the books the user has to offer one of them in exchange
        Book.find(query, function(err, docs) {
            if (err) throw err;

            var userTitles = docs.map(function(book) {
                return {
                    bookId: book.bookId,
                    title: book.title
                };
            });

            res.render('book_propose_trade', {
                logged: res.locals.logged,
                user: res.locals.user,
                bookTitles: userTitles,
                bookId: req.params.bookId
            });
        });
    }
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

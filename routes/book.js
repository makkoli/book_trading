var Book = require('../models/book-model');

// Get a books details
exports.getBookDetails = function(req, res) {
    var query = { bookId: req.params.bookId };

    // Retrieve a chunk of books to display on home page
    Book.findOne(query, function(err, doc) {
        if (err) throw err;

        if (doc === null) {
            res.render('template', {
                message: "No such book",
                logged: res.locals.logged,
                user: res.locals.user
            });
        }
        else {
            var bookDetails = {
                bookId: doc.bookId,
                title: doc.title,
                author: doc.author,
                coverPath: doc.cover,
                user: doc.user
            };

            res.render('book_details', {
                logged: res.locals.logged,
                user: res.locals.user,
                book: bookDetails,
                // checks if the user owns the book to display propose button
                userOwnsBook: res.locals.user === doc.user
            });
        }
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

            // check if user owns book so they can't propose on their
            // own book
            // returns true if current book is owned by user
            //  flip the value since the every function needs to go through
            //  every book that the user owns
            var doesUserOwnBook = !docs.every(function(book) {
                return req.params.bookId != book.bookId;
            });

            res.render('book_propose_trade', {
                logged: res.locals.logged,
                user: res.locals.user,
                userBookTitles: userTitles,
                bookToTradeForId: req.params.bookId,
                userOwnsBook: doesUserOwnBook
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

// Handles a trade proposal from the user
exports.processTradeProposal = function(req, res) {
    // the user didn't choose a book to trade for
    if (Object.keys(req.body).length === 0) {
        res.render('template', {
            message: "You must select a book",
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
    // else process trade if user is authenticated
    else if (res.locals.logged) {
        // book id from user submitted form
        var findQuery = { bookId: req.body.bookId };
        var updateQuery = { bookId: req.params.bookId };
        // find all book titles to add to the trade proposal
        Book.findOne(findQuery, function(err, doc) {
            if (err) throw err;

            var update = {"$push": { proposed_trades:
                {
                    bookId: doc.bookId,
                    title: doc.title,
                    owner: doc.user
                }
            }};

            // update the book trade proposals with the new proposal
            Book.update(updateQuery, update, function(err) {
                if (err) throw err;

                res.render('template', {
                    message: "Proposal Sent"
                });
            });
        });
    }
    // else, there was some error
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

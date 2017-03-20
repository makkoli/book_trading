var User = require('../models/user-model'),
    Book = require('../models/book-model');

// String Function -> Object
// Gets the user info from the db
exports.getUserInfo = function(user, cb) {
    var userQuery = { username: user };

    // Fetch the users information from the db
    User.findOne(userQuery, function(err, doc) {
        if (err) cb(true, null);

        cb(null, doc);
    });
};

// String Function -> [Object]
// Gets the users book from the db
exports.getUserBooks = function(user, cb) {
    var bookQuery = { user: user };

    Book.find(bookQuery, function(err, docs) {
        if (err) cb(true, null);

        cb(null, docs);
    });
};

// String String [Object] Function -> undefined
// Upadtes the users completed trades
exports.updateUserCompletedTrades = function(user, fromUser,
    bookGiven, bookReceived, cb) {
    var user = { username: user };
    var update = {
        "$push": {
            completed_trades: {
                fromUser: fromUser,
                bookGiven: bookGiven,
                bookReceived: bookReceived,
                date: Date.now()
            }
        }
    };

    User.update(user, update, function(err) {
        if (err) cb(true, null);
        else cb(null, true);
    });
};

// [String] Function -> undefined
// Removes proposed trades of a book when the user completes a trade
exports.removeProposedTrades = function(bookIds, cb) {
    var query = {};
    var update = {
        "$pull": {
            proposed_trades: {
                bookId: { $in: bookIds }
            }
        }
    };
    var options = { multi: true };

    Book.update(query, update, options, function(err) {
        if (err) cb(true, null);
        else cb(null, true);
    });
};

// [String] Function -> undefined
// Removes a given list of books from the db
exports.removeBooks = function(books, cb) {
    var query = { bookId: { "$in": books } };

    Book.remove(query, function(err) {
        if (err) cb(true, null);
        else cb(null, true);
    });
}

// String Function -> Object
// Gets the book info for one book from the books id
exports.getBookInfo = function(bookId, cb) {
    var query = { bookId: bookId };

    Book.findOne(query, function(err, doc) {
        if (err) cb(true, null);

        cb(null, doc);
    });
};

// [String] Function -> [Object]
// Gets the book info for multiple books from the book ids
exports.getMultipleBookInfo = function(bookIds, cb) {
    var query = { bookId: { "$in": bookIds } };

    Book.find(query, function(err, docs) {
        if (err) cb(true, null);

        cb(null, docs);
    });
};

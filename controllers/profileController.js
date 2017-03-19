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

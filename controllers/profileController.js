var User = require('../models/user-model'),
    Book = require('../models/book-model');

// String Function -> Object
// Gets the user location info from the db
exports.getUserInfo = function(user, cb) {
    var userQuery = { username: user };

    // Fetch the users information from the db
    User.findOne(userQuery, function(err, doc) {
        if (err) cb(true, null);

        cb(null, {
                user: doc.username,
                firstName: doc.first_name,
                lastName: doc.last_name,
                city: doc.city,
                state: doc.state
            }
        );
    });
}

// String Function -> [Object]
// Gets the users book from the db
exports.getUserBooks = function(user, cb) {
    var bookQuery = { user: user };

    Book.find(bookQuery, function(err, docs) {
        if (err) cb(true, null);

        var userBooks = docs.map(function(book) {
            return {
                id: book.bookId,
                title: book.title,
                author: book.author
            };
        });

        cb(null, userBooks);
    });
}

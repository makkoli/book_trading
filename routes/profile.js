var User = require('../models/user-model'),
    Book = require('../models/book-model'),
    Promise = require('promise');

// Profile page
exports.index = function(req, res) {
    // if user logged in with correct username
    if (res.locals.logged && res.locals.user === req.params.user) {
        var userPromise = new Promise(function(resolve, reject) {
            getUserInfo(req.params.user, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });
        var bookPromise = new Promise(function(resolve, reject) {
            getUserBooks(req.params.user, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });

        Promise.all([userPromise, bookPromise])
        .then(function(response) {
            console.log(response);
            var userInfo = response[0],
                userBooks = response[1];

            res.render('profile', {
                logged: res.locals.logged,
                user: userInfo.user,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                city: userInfo.city,
                state: userInfo.state,
                userBooks: userBooks
            });
        })
        .catch(function(err) {
            console.log(err);
        });
    }
    // render unauthorized if not logged in
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

// String Function -> Object
// Gets the user location info from the db
function getUserInfo(user, cb) {
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
function getUserBooks(user, cb) {
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

// Edit a user profiles
exports.editGet = function(req, res) {
    if (res.locals.logged && res.locals.user === req.params.user) {
        // profile edit page
        res.render('profile_edit', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

// Update the users profile after changes are made
exports.editPost = function(req, res) {
    if (res.locals.logged && res.locals.user === req.params.user) {
        var query = { username: req.params.user };
        var updateQuery = {
            $set: {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                city: req.body.city,
                state: req.body.state
            }
        };

        User.update(query, updateQuery, null, function(err) {
            if (err) throw err;

            res.redirect('/' + req.params.user + '/profile');
        });
    }
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

// Let the user add a book to his profile to trade
exports.addBookGet = function(req, res) {
    if (res.locals.logged && res.locals.user === req.params.user) {
        // add a book
        res.render('profile_add', {
            error: "",
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

// Add the users book to his profile after he submits it
exports.addBookPost = function(req, res) {
    // logged in
    if (res.locals.logged && res.locals.user === req.params.user) {
        // check if title is added and author are added
        if (req.body.title === undefined || req.body.author === undefined) {
            res.render('profile_add', {
                error: "Missing Title",
                logged: res.locals.logged,
                user: res.locals.user
            });
        }
        else {
            // Add new book to user in the db
            var query = { username: req.params.user };
            var book = new Book({
                    bookId: Date.now() - req.file.size,
                    cover: req.file.path,
                    title: req.body.title,
                    author: req.body.author,
                    user: req.params.user
                });

            book.save(function(err, data) {
                if (err) { console.log(err); throw err; }

                res.redirect('/' + res.locals.user + '/profile');
            });
        }
    }
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

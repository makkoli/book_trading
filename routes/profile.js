var User = require('../models/user-model'),
    Book = require('../models/book-model'),
    profileController = require('../controllers/profileController'),
    Promise = require('promise');

// Profile page
exports.index = function(req, res) {
    // if user logged in with correct username
    if (res.locals.logged && res.locals.user === req.params.user) {
        var userPromise = new Promise(function(resolve, reject) {
            profileController.getUserInfo(req.params.user, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });
        var bookPromise = new Promise(function(resolve, reject) {
            profileController.getUserBooks(req.params.user, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });

        Promise.all([userPromise, bookPromise])
        .then(function(response) {
            var userInfo = response[0],
                userBooks = response[1];

            res.render('profile', {
                logged: res.locals.logged,
                user: userInfo.username,
                firstName: userInfo.first_name,
                lastName: userInfo.last_name,
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
        if (req.body.title === "" || req.body.author === "") {
            res.render('profile_add', {
                error: "Missing Field",
                logged: res.locals.logged,
                user: res.locals.user
            });
        }
        else {
            // Add new book to user in the db
            var query = { username: req.params.user };
            var book = new Book({
                    bookId: Date.now() - req.file.size,
                    // take off the public base directory
                    cover: req.file.path.match(/\/.*/)[0],
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

// Gets the users current proposals
exports.getBookProposal = function(req, res) {
    // logged in
    if (res.locals.logged && res.locals.user === req.params.user) {
        var query = { bookId: req.params.bookId };
        // Get the books proposed trades from other users
        var bookProposedTrades;
        new Promise(function(resolve, reject) {
            profileController.getBookInfo(req.params.bookId,
                function(err, book) {
                    if (err) reject(err);
                    else resolve(book);
                }
            );
        }).then(function(response) {
            // If there are no proposed trades render a default message
            if (response.length === 0) {
                res.render('template', {
                    message: "No proposed trades",
                    logged: res.locals.logged,
                    user: res.locals.user
                });
            }
            // else, render all proposals
            else {
                res.render('proposals', {
                    logged: res.locals.logged,
                    user: res.locals.user,
                    bookToTradeForId: response.bookId,
                    bookToTradeForTitle: response.title,
                    tradeProposals: response.proposed_trades
                });
            }
        }).catch(function(error) {
            console.log(error);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(null);
        });
    }
    else {
        res.render('error', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    }
};

// Complete the trade between two user and remove the books from the db
exports.completeTrade = function(req, res) {
    var userQuery = { username: req.params.user },
        userUpdate,
        bookQuery = { bookId: req.params.bookId },
        proposalNum = req.params.proposalNum;

    // Retrieve the proposed trades for the book the user owns and
    // is trading
    new Promise(function(resolve, reject) {
        profileController.getBookInfo(req.params.bookId, function(err, res) {
            if (err) reject(err);
            else resolve(res);
        });
    // Then, add all the book info to the completed trades on each
    // users profile and remove the books from the db
    }).then(function(response) {
        var bookBeingGiven = {
            bookId: response.bookId,
            title: response.title
        };
        var bookBeingGivenOwner = response.user;
        var bookBeingReceived = {
            bookId: response.proposed_trades[req.params.proposalNum].bookId,
            title: response.proposed_trades[req.params.proposalNum].title
        };
        var bookBeingReceivedOwner =
            response.proposed_trades[req.params.proposalNum].owner;
        console.log('response', response);
        console.log('book being given', bookBeingGiven);
        console.log('book being given owner', bookBeingGivenOwner);
        console.log('book being received', bookBeingReceived);
        console.log('book being received owner', bookBeingReceivedOwner);
        // add the completed trade to the user
        var userAccepting = new Promise(function(resolve, reject) {
            profileController.updateUserCompletedTrades(bookBeingGivenOwner,
                bookBeingReceived.owner, bookBeingGiven, bookBeingReceived,
                function(err, res) {
                    if (err) reject(err);
                    else resolve(res);
                });
        });

        // add completed trade from the other user
        var userOffering = new Promise(function(resolve, reject) {
            profileController.updateUserCompletedTrades(bookBeingReceived.owner,
                bookBeingGivenOwner, bookBeingReceived, bookBeingGiven,
                function(err, res) {
                    if (err) reject(err);
                    else resolve(res);
                });
        });


        // get the books to remove
        var booksToRemove = [
            req.params.bookId,
            response.proposed_trades[req.params.proposalNum].bookId
        ];
        console.log('books to remove', booksToRemove);

        // remove the books
        var removeBooks = new Promise(function(resolve, reject) {
            profileController.removeBooks(booksToRemove,
                function(err, res) {
                    if (err) reject(err);
                    else resolve(res);
                });
        });

        // remove the trade proposals from all other books
        var removeTradeProposals = new Promise(function(resolve, reject) {
            profileController.removeProposedTrades(bookIds, function(err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });

        // execute all the promises and redirect
        Promise.all([userAccepting, userOffering,
            removeBooks, removeTradeProposals]);
        res.redirect('/' + req.params.user + '/profile');
    }).catch(function(error) {
        console.log(error);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(null);
    });
};

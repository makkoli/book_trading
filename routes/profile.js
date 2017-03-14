var User = require('../models/user-model');

// Profile page
exports.index = function(req, res) {
    // if user logged in with correct username
    if (res.locals.logged && res.locals.user === req.params.user) {
        var userQuery = { username: res.locals.user };

        User.findOne(userQuery, function(err, doc) {
            if (err) throw err;

            res.render('profile', {
                logged: res.locals.logged,
                user: doc.username,
                firstName: doc.first_name,
                lastName: doc.last_name,
                city: doc.city,
                state: doc.state
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

// Edit a user profiles
exports.editGet = function(req, res) {
    if (res.locals.logged && res.locals.user === req.params.user) {
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
        res.render('profile_add', {
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

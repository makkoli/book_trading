var User = require('../models/user-model');

// Profile page
exports.index = function(req, res) {
    // if user logged in with correct username
    if (res.locals.logged && res.locals.user === req.params.user) {
        var userQuery = { username: res.locals.user };

        User.findOne(userQuery, function(err, doc) {
            if (err) throw err;
            console.log(doc);

            res.render('profile', {
                user: doc.username,
                firstName: doc.first_name,
                lastName: doc.last_name,
                city: doc.city,
                state: doc.state
            });
        });
    }
    else {
        res.render('error');
    }
};

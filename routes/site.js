var Book = require('../models/book-model');

// Landing page
exports.index = function(req, res) {
    console.log(req.session);
    var query = {};

    // Retrieve a chunk of books to display on home page
    Book.find(query, function(err, docs) {
        if (err) throw err;

        console.log(docs);

        res.render('index', {
            logged: res.locals.logged,
            user: res.locals.user
        });
    });
};

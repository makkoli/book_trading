// Landing page
exports.index = function(req, res) {
    console.log(req.session);
    res.render('index', {
        logged: res.locals.logged,
        user: res.locals.user
    });
};

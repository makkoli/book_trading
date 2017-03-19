var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// define book Schema
var BookSchema = new Schema({
    bookId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: ""
    },
    // path to the image file
    cover: {
        type: String,
        default: "public/images/book_covers/no_cover.jpg"
    },
    user: {
        type: String,
        required: true
    },
    proposed_trades: {
        type: [],
        default: []
    }},
    {
        collection: 'books'
    }
);

module.exports = mongoose.model('Book', BookSchema);

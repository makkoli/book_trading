var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// define book Schema
var BookSchema = new Schema({
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
        default: "/images/no_cover.jpg"
    }
    user: {
        type: String,
        required: true
    },
    proposed_trades: {
        type: [String],
        default: []
    }},
    {
        collection: 'books'
    }
);

module.exports = mongoose.model('Book', BookSchema);

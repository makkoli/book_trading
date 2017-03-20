var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
    twitterId: {
        type: String,
        required: true,
        index: { unique: true }
    },
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    completed_trades: {
        type: [],
        default: []
    }},
    {
        collection: 'users'
    }
);

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);

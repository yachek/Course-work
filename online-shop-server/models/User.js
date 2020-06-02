const mongoose = require('mongoose');
const paspportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
    username: {
        type: String,
        default: '',
        required: true
    },
    firstName: {
        type: String,
        default: '',
        required: true
    },
    lastName: {
        type: String,
        default: '',
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

User.plugin(paspportLocalMongoose);

module.exports = mongoose.model('User', User);
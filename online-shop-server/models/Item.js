const mongoose = require('mongoose');

const Item = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    photoPath: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Item', Item);
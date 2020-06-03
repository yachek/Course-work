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
    shortDescription: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    photoPath: {
        type: String,
        default: ''
    },
    likes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Item', Item);
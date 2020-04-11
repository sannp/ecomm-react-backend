const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const phoneSchema = new Schema({
    _ID: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    inCart: {
        type: Boolean,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    }  
}, {
    timestamps: true,
});

const Phone = mongoose.model('Phone', phoneSchema);

module.exports = Phone;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ //pravi semu, tj model kako treba da izgleda user
    type: {
        type: String,
        required: true,
        min: 7,
        max: 10
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    username: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    jmbg: {
        type: String,
        required: true,
        min: 13,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 4,
        max: 255
    }
});

module.exports = mongoose.model('User', userSchema); //postavlja Useru malopre kreiranu semu
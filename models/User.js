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
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jmbg: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema); //postavlja Useru malopre kreiranu semu
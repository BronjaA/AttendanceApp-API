const mongoose = require('mongoose');

const profSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    department: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    profile: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    }]
});

module.exports = mongoose.model('Professor', profSchema);
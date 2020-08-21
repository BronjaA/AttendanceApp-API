const mongoose = require('mongoose');

const profSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    }]
});

module.exports = mongoose.model('Professor', profSchema);
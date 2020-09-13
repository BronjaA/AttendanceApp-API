const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'  
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    aptFrom: {
        type: Date,
        required: true
    },
    aptTo: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    banned: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }]
});

module.exports = mongoose.model('Activity', activitySchema);
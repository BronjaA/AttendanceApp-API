const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'  
    },
    type: {
        type: String,
        required: true,
        min: 7,
        max: 10
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
        required: true,
        min: 2,
        max: 255
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }]
});

module.exports = mongoose.model('Activity', activitySchema);
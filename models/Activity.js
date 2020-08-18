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
    appointment: {
        type: String,
        required: true,
        min: 2,
        max: 255
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
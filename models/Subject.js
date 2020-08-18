const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    department: [{
        type: String,
        required: true,
        min: 2,
        max: 255
    }],
    profile: [{
        type: String,
        required: true,
        min: 2,
        max: 255
    }],
    yearOfStudy: [{
        type: String,
        required: true,
        min: 2,
        max: 255
    }],
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    description: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    }],
    professors: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Professor'
    }],
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Activity'
    }]
    
});

module.exports = mongoose.model('Subject', subjectSchema);
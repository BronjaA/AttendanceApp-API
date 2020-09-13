const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    department: [{
        type: String,
        required: true
    }],
    profile: [{
        type: String,
        required: true
    }],
    yearOfStudy: [{
        type: String,
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
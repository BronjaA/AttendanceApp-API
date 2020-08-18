const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
    yearOfStudy:{
        type: String,
        required: true
    },
    indexNr: {
        type: String,
        required: true,
        min: 5,
        max: 10
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    }]
});

module.exports = mongoose.model('Student', studentSchema);
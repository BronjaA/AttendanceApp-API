const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    department: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    yearOfStudy:{
        type: String,
        required: true
    },
    indexNr: {
        type: String,
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    }]
});

module.exports = mongoose.model('Student', studentSchema);
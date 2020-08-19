const router = require('express').Router();
const Subject = require('../../models/Subject');
const Student = require('../../models/Student');
const Professor = require('../../models/Professor');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.post('/create', async (req, res) => {
    
    const subject = new Subject({
        department: req.body.department,
        profile: req.body.profile,
        yearOfStudy: req.body.yearOfStudy,
        name: req.body.name,
        description: req.body.description,
        students: req.body.students,
        professors: req.body.professors,
    });
    try{
        const savedSubject = await subject.save();
        res.send('Subject added successfully!');
    }catch(err){
        res.status(400).send(err);
    }
});

router.patch('/update/:subjectID', async (req, res) => {
    try{
        const updatedSubject = await Subject.updateOne({_id: req.params.subjectID},
            { $set: { students: req.body.students } },
            { $set: { professors: req.body.professors}});
        res.send('Subject updated successfully!');
    }catch(err){
        res.status(400).send(err);
    }

});

router.post('/get-user-subjects/:token', async (req, res) => {
    try{
        const verifiedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);
        
        // prvo nalazi usera kojem pripada taj token
        var userID = mongoose.Types.ObjectId;
        userID = mongoose.Types.ObjectId(verifiedToken._id);
        const verifiedUser = await User.findOne({_id: userID});

        if(verifiedUser.type == 'Student')
        {
            const verifiedStudent = await Student.findOne({user: userID});
            return res.status(200).send(verifiedStudent.subjects);
        }
        else if(verifiedUser.type == 'Profesor')
        {
            const verifiedProfessor = await Professor.findOne({user: userID});
            return res.status(200).send(verifiedProffesor.subjects);
        }

    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;
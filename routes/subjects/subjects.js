const router = require('express').Router();
const Subject = require('../../models/Subject');
const Student = require('../../models/Student');
const Professor = require('../../models/Professor');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/User');

router.post('/create', async (req, res) => {
    
    const subject = new Subject({
        department: req.body.department,
        profile: req.body.profile,
        yearOfStudy: req.body.yearOfStudy,
        name: req.body.name,
        description: req.body.description,
        students: req.body.students,
        professors: req.body.professors,
        activities: req.body.activities
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

        const verifiedStudent = await Student.findOne({user: userID});
        const verifiedProfessor = await Professor.findOne({user: userID});

        if(verifiedStudent)
        {
            const allSubjects = verifiedStudent.subjects;
            var foundSubjects = [];

            for(let i=0; i < allSubjects.length; i++)
            {
                foundSubjects.push(await Subject.findOne({_id: allSubjects[i]}));
            }
            
            return res.status(200).send(foundSubjects);
        }
        else if(verifiedProfessor)
        {
            const allSubjects = verifiedProfessor.subjects;
            var foundSubjects = [];

            for(let i=0; i < allSubjects.length; i++)
            {
                foundSubjects.push(await Subject.findOne({_id: allSubjects[i]}));
            }
            
            return res.status(200).send(foundSubjects);
        }

    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/get-profile-subjects/:token', async (req, res) => {
    try{

        const verifiedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

        // prvo nalazi usera kojem pripada taj token
        var userID = mongoose.Types.ObjectId;
        userID = mongoose.Types.ObjectId(verifiedToken._id);

        const verifiedStudent = await Student.findOne({user: userID});

        if(verifiedStudent)
        {
            const studentDepartment = verifiedStudent.department;
            const studentProfile = verifiedStudent.profile;

            const subjects = await Subject.find({department: studentDepartment, profile: studentProfile, yearOfStudy: req.body.yearOfStudy});

            res.status(200).send(subjects);
        }
    }catch(err){
        res.status(400).send(err);
    }
});

// metoda za profesora prilikom prvog biranja predmeta
router.post('/get-specific-subjects', async (req, res) => {
    try{
        const subjects = await Subject.find({department: req.body.department, profile: req.body.profile, yearOfStudy: req.body.yearOfStudy});

        var praviSubjects = [];

        for (var i = 0; i<subjects.length; i++)
        {
            for (var j = 0; j<subjects[i].department.length; j++)
            {
                if (subjects[i].department[j] == req.body.department)
                {
                    if (subjects[i].yearOfStudy[j] == req.body.yearOfStudy)
                    praviSubjects.push(subjects[i]);
                }
            }
        }

        res.status(200).send(praviSubjects);

    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/get-students', async (req, res) => {
    try{
        const izabraniPredmet = await Subject.findOne({_id: req.body.subjID});

        var upisaniStudenti = [];
        var upisaniUseri = [];
        for (let i=0; i < izabraniPredmet.students.length; i++)
        {
            var jedanStud = await Student.findOne({_id: izabraniPredmet.students[i]});
            upisaniStudenti.push(jedanStud);
            upisaniUseri.push(await User.findOne({_id: jedanStud.user}));
        }
        res.status(200).send([upisaniStudenti, upisaniUseri]);

    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;
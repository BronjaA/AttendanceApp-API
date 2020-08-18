const router = require('express').Router();
const Subject = require('../../models/Subject');

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

module.exports = router;
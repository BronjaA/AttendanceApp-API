const router = require('express').Router();
const Student = require('../../../models/Student');
const Subject = require('../../../models/Subject');
const Activity = require('../../../models/Activity');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const upisiMe = async function (data) {     // upis na predmet
    const upisiStudent = await Student.updateOne({_id: data.studentID},
        { $push: { subjects: data.subjectID } });
    const zavediPredmeti = await Subject.updateOne({_id: data.subjectID},   // ovde cu verovatno morat updateMany jer ce se upisivat na
                                                                            // vise predmeta
        { $push: { students: data.studentID } });
}

const prijaviMe = async function (data) {
    const prijaviStudenta = await Activity.updateOne({_id: data.activityID},
        { $push: { attendees: data.studentID} });
}

router.patch('/upisi', async (req, res) => {

    try{
        await upisiMe({
            studentID: req.body.studentID,
            subjectID: req.body.subjectID
        });
        res.send('Student uspesno upisan na predmet!');
    }catch(err)
    {
        res.status(400).send(err);
    }
    
});

router.patch('/prijavi', async (req, res) => {

    try{
        await prijaviMe({
            activityID: req.body.activityID,
            studentID: req.body.studentID
        });
        res.send('Student uspesno prijavljen na aktivnost!');
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/is-set-up/:token', async (req, res) => {
    try{
        const verifiedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

        var userID = mongoose.Types.ObjectId;
        userID = mongoose.Types.ObjectId(verifiedToken._id);

        const verifiedStudent = await Student.findOne({user: userID});

        if(verifiedStudent)
        {
            if(verifiedStudent.subjects)
                return res.status(200).send(true);
            else return res.status(200).send(false);
        }
        else res.status(400).send('User not found!');

    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;
module.exports.upisiMe = upisiMe;
module.exports.prijaviMe = prijaviMe;
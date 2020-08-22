const router = require('express').Router();
const Activity = require('../../../models/Activity');
const Professor = require('../../../models/Professor');
const Subject = require('../../../models/Subject');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const odjaviStudenta = async function (data){
    const odjavi = await Activity.updateOne({_id: data.activityID},
        { $pull: {attendees: data.studentID} });
}

router.patch('/odjaviStudenta', async (req, res) => {
    try{
        await odjaviStudenta({
            activityID: req.body.activityID,
            studentID: req.body.studentID
        });
        res.send('Student uspesno odjavljen sa izabrane aktivnosti!');
    }catch(err){
        res.status(400).send(err);
    }
});

router.patch('/dodajPredmete/:token', async (req, res) => {
    try{
        const verifiedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

        var userID = mongoose.Types.ObjectId;
        userID = mongoose.Types.ObjectId(verifiedToken._id);

        const verifiedProfessor = await Professor.findOne({user: userID});

        const dodajProfesoru = await Professor.updateOne({user: userID}, {$set: {subjects: req.body.subjects}});

        for (let i=0; i < req.body.subjects.length; i++)
        {
            const zavediPredmet = await Subject.updateOne({_id: req.body.subjects[i]}, {$push: {professors: verifiedProfessor._id}});
        }

        res.status(200).send('Profesor uspesno dodao sve predmete!');
        
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;
module.exports.odjaviStudenta = odjaviStudenta;
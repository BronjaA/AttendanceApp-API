const router = require('express').Router();
const Activity = require('../../models/Activity');
const Subject = require('../../models/Subject');
const User = require('../../models/User');
const Student = require('../../models/Student');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.post('/create', async (req, res) => {
    
    const activity = new Activity({
        subject: req.body.subject,
        type: req.body.type,
        date: req.body.date,
        appointment: req.body.appointment,
        location: req.body.location,
        attendees: req.body.attendees
    });
    try{
        const savedActivity = await activity.save();
        res.send('Uspesno ste dodali aktivnost!');
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/getByID', async (req, res) => {
    try{
        var activities = [];
        for(let i=0; i < req.body.actID.length; i++)
        {
            activities.push(await Activity.findOne({_id: req.body.actID[i]}));
        }

        if(activities)
        {
            res.status(200).send(activities);
        }
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/createLecture', async (req, res) => {
    try{
        var allActivities = [];
        for(let i=0; i < 12; i++)
        {
            var activity = new Activity({
                subject: req.body.subject,
                type: req.body.type,
                date: req.body.date[i],
                aptFrom: req.body.aptFrom,
                aptTo: req.body.aptTo,
                location: req.body.location
            });
            var postavi = await activity.save();
            allActivities.push(activity._id);
        }
        const upisiPredmetu = await Subject.updateOne({_id: req.body.subject}, {$push: {activities: allActivities}});
        res.status(200).send('Uspesno dodao 12 aktivnosti!');
    }catch(err){
        res.status(400).send(err);
    }
});

router.patch('/updateActivities', async (req, res) => {
    try{
        for(let i = 0; i < 12; i++)
        {
            var updated = await Activity.updateOne({_id: req.body.activity[i]}, {$set: {date: req.body.date[i], aptFrom: req.body.aptFrom, aptTo: req.body.aptTo, location: req.body.location}});
        }
        if(updated)
        res.status(200).send('Uspesno ste izmenili 12 aktivnosti');
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/getAttendees', async (req, res) => {
    try{
        var izabranaAktivnost = await Activity.findOne({_id: req.body.activity});

        var prisutniUseri = [];
        var prisutniStudenti = [];
        if(izabranaAktivnost)
        {

            for (let i = 0; i < izabranaAktivnost.attendees.length; i++)
            {
                var tajStudent = await Student.findOne({_id: izabranaAktivnost.attendees[i]});
                prisutniStudenti.push(tajStudent);
                prisutniUseri.push(await User.findOne({_id: tajStudent.user}));
            }

            if (prisutniUseri)
            {
                //res.status(200).send(prisutniUseri);
                res.status(200).send([prisutniUseri, prisutniStudenti]);
            }
                
        }
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/studentAttendee', async (req, res) => {
    try{
        var studenti = [];
        for (let i=0; i < req.body.userIDs.length; i++)
        {
            studenti.push(await Student.findOne({user: req.body.userIDs[i]}));
        }
        if(studenti)
            res.status(200).send(studenti);
    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/getStudentActivities/:token', async (req, res) => {
    try{
        const verifiedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

        // prvo nalazi usera kojem pripada taj token
        var userID = mongoose.Types.ObjectId;
        userID = mongoose.Types.ObjectId(verifiedToken._id);

        // nalazi studenta sa kojim je povezan prethodni user
        const verifiedStudent = await Student.findOne({user: userID});

        if(verifiedStudent)
        {
            const allSubjects = verifiedStudent.subjects;
            var foundSubject;
            var foundActivity;
            var allAcct = [];

            for(let i=0; i < allSubjects.length; i++)
            {
                foundSubject = await Subject.findOne({_id: allSubjects[i]});
                
                for (let j = 0; j < foundSubject.activities.length; j++)
                {
                    foundActivity = await Activity.findOne({_id: foundSubject.activities[j]});
                    allAcct.push(foundActivity);
                }
            }

            res.status(200).send([allAcct, verifiedStudent._id]);
        }
    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/signMe/:token', async (req, res) => {
    try{
        // salje mu se id aktivitija na koji treba da se upise. UpdateOne upise se u attendees id studenta
        const verifiedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

        // prvo nalazi usera kojem pripada taj token
        var userID = mongoose.Types.ObjectId;
        userID = mongoose.Types.ObjectId(verifiedToken._id);

        // nalazi studenta sa kojim je povezan prethodni user
        const verifiedStudent = await Student.findOne({user: userID});

        var upisan = await Activity.updateOne({_id: req.body.activity}, {$push: {attendees: verifiedStudent._id}});
        
        if(upisan)
        {
            res.status(200).send('hoce');
        }
    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/izbrisiStudenta', async (req, res) => {
    try{
        
        const sentUser = await User.findOne({_id: req.body.userID});
        const foundStudent = await Student.findOne({user: sentUser._id});

        const aktiviti = await Activity.findOne({_id: req.body.activityID});

        var izbrisi = await Activity.updateOne({_id: aktiviti._id}, {$pull: {attendees: foundStudent._id}});
        var banuj = await Activity.updateOne({_id: aktiviti._id}, {$push: {banned: foundStudent._id}});

        if(izbrisi && banuj)
        {
            res.status(200).send('Uspesno!');
        }
        
    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/addStudent', async (req, res) => {
    try{
        
        const student = await Student.findOne({_id: req.body.studentID});

        var dodaj = await Activity.updateOne({_id: req.body.activityID}, {$push: {attendees: student._id}});

        if (dodaj)
        {
            res.status(200).send('Uspesno!');
        }
        
    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/getBySubject', async (req, res) => {
    try{
        const sentSubject = await Subject.findOne({_id: req.body.subjectID});

        var sveAktivnosti = [];

        for(let i=0; i < sentSubject.activities.length; i++)
        {
            sveAktivnosti.push(await Activity.findOne({_id: sentSubject.activities[i]}));
        }

        if(sveAktivnosti)
        {
            res.status(200).send(sveAktivnosti);
        }
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;
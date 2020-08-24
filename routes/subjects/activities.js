const router = require('express').Router();
const Activity = require('../../models/Activity');
const Subject = require('../../models/Subject');

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

        if(izabranaAktivnost)
        {
            res.status(200).send(izabranaAktivnost.attendees);
        }
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;
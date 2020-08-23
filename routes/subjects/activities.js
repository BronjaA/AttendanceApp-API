const router = require('express').Router();
const Activity = require('../../models/Activity');

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
})

module.exports = router;
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

module.exports = router;
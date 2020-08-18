const router = require('express').Router();
const Activity = require('../../../models/Activity');

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
})

module.exports = router;
module.exports.odjaviStudenta = odjaviStudenta;
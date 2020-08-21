const router = require('express').Router(); // const za sve rute u auth.js
const User = require('../models/User');      // dobijamo access za User.js
const Professor = require('../models/Professor');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {registerValidation, loginValidation} = require('../validation'); // importuje fajl za validaciju

//####### REGISTRACIJA #########
router.post('/register', async (req, res) => {    // ovo je jedna ruta - register

    // Validacija unetih podataka pre kreiranja korisnika
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);    // ako ima error poslace status 400 i nece
                                                                        // izvsrit ovo dole   

    // Proveravamo da korisnik vec nije u bazi - proveravamo da ne bi imalo duplikata
    const emailExists = await User.findOne({email: req.body.email});    //ovo await se koristi prilikom rada s bazom
    if(emailExists) return res.status(400).send('Email already exists');

    const unameExists = await User.findOne({password: req.body.username});
    if(unameExists) return res.status(400).send('Username taken');

    const jmbgExists = await User.findOne({password: req.body.jmbg});
    if(jmbgExists) return res.status(400).send('JMBG taken');

    // Hashovanje sifre
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        type: req.body.type,
        verified: req.body.verified,
        name: req.body.name,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        jmbg: req.body.jmbg,
        email: req.body.email
    });
    try{
        const savedUser = await user.save();
        
        if(user.type == 'Professor')
        {
            const prof = new Professor({
                user: user._id
            });
            const savedProfessor = await prof.save();
            res.send({user: user._id});
        }
        else if(user.type == 'Student')
        {
            const student = new Student({
                user: user._id,
                department: req.body.department,
                profile: req.body.profile,
                yearOfStudy: req.body.yearOfStudy,
                indexNr: req.body.indexNr
            })
            const savedStudent = await student.save();
            res.send({user: user._id});
        }
            
    }catch(err){
        res.status(400).send(err);
    }
});

//####### LOGIN ########
router.post('/login', async (req, res) => {
    // Validacija unetih podataka
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Proverava da li email vec postoji
    const user = await User.findOne({email: req.body.email});  // nalazi usera kod koga je email uneti email
    if(!user) return res.status(400).send('Email or password is wrong');
    // Da li je sifra tacna
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Ivalid passowrd');

    // Kreiranje tokena
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.send(token);
});

//######### VALIDACIJA TOKENA ######
router.post('/login/:token', async (req, res) => {
    try{
        const verifiedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);   //validira token koji smo poslali preko params

        var userID = mongoose.Types.ObjectId;
        userID = mongoose.Types.ObjectId(verifiedToken._id);    // userID uzima vrednost id usera koji ima token

        const verifiedUser = await User.findOne({_id: userID});  // nalazi usera sa tim idijem

        if(verifiedUser)
            return res.status(200).send(verifiedUser.type);
        else res.status(400).send('User not found!');


    }catch(err){
        res.status(400).send(err);
    }
})


module.exports = router;

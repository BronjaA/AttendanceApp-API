const router = require('express').Router(); // const za sve rute u auth.js
const User = require('../models/User');      // dobijamo access za User.js
const Professor = require('../models/Professor');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const {registerValidation, loginValidation} = require('../validation'); // importuje fajl za validaciju

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.HOTMAIL_USER,
        pass: process.env.HOTMAIL_PASSWORD,
    }
})

//####### REGISTRACIJA #########
router.post('/register', async (req, res) => {    // ovo je jedna ruta - register

    // Proveravamo da korisnik vec nije u bazi - proveravamo da ne bi imalo duplikata
    const emailExists = await User.findOne({email: req.body.email});    //ovo await se koristi prilikom rada s bazom
    if(emailExists) return res.status(400).send('Uneta E-Mail adresa već pripada nekom korisniku');

    const unameExists = await User.findOne({username: req.body.username});
    if(unameExists) return res.status(400).send('Uneto korisničko ime je zauzeto');

    const jmbgExists = await User.findOne({jmbg: req.body.jmbg});
    if(jmbgExists) return res.status(400).send('Već postoji nalog sa unetim JMBG');

    const indexExists = await Student.findOne({indexNr: req.body.indexNr});
    if(indexExists) return res.status(400).send('Već postoji nalog sa unetim brojem indexa');

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
        }

        await jwt.sign(
            { _id: user._id },
            process.env.EMAIL_SECRET,
            { expiresIn: '1d' },
            (err, emailToken) => {
                const url = `https://attendance-app997.herokuapp.com/api/user/confirmEmail/${emailToken}`;

                transporter
                    .sendMail({
                        from: process.env.HOTMAIL_USER,
                        to: user.email,
                        subject: 'Potvrda E-Mail adrese',
                        html: `Da bi završili proces registracije potvrdite svoju E-Mail adresu klikom na <a href="${url}">OVAJ LINK</a>`
                    })
                    .catch(err);
            }
        );
        res.status(200).send('Ekstra');
            
    }catch(err){
        res.status(400).send(err);
    }
});

router.get('/confirmEmail/:etoken', async (req, res) => {
    try{
        const decodedToken = jwt.verify(
            req.params.etoken,
            process.env.EMAIL_SECRET
        );
        var confirmation = await User.updateOne({_id: decodedToken._id}, {$set: {verified: true}});
        if(confirmation)
        res.status(200).send('Uspešno ste potvrdili E-Mail!'); 
    }catch (err){

    }
})

//####### LOGIN ########
router.post('/login', async (req, res) => {

    // Proverava da li email vec postoji
    const user = await User.findOne({email: req.body.email});  // nalazi usera kod koga je email uneti email
    if(!user) return res.status(400).send('Ne postoji korisnik sa unetom E-Mail adresom!');
    // Da li je sifra tacna
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('E-Mail ili šifra nisu tačne!');

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

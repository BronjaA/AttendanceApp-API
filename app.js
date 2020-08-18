const express = require('express');     //uspostavlja server - express zapravo upravlja rutama
const app = express();                  //ovo je valjda ime nase app koja ce da koristi server
const mongoose = require('mongoose');   //za rad sa mongoDB
const dotenv = require('dotenv');       //nesto vezano za ono .env da nam onaj string ne bude direktno u index
// Importuje rute ovde koje smo odvojili u drugom fajlu radi preglednosti
const authRoute = require('./routes/auth');
const subjects = require('./routes/subjects/subjects');
const activities = require('./routes/subjects/activities');
const students = require('./routes/users/students/student');
const professors = require('./routes/users/professors/professor');

dotenv.config();

// Middleware
app.use(express.json());    //omogucava nam da koristimo post requests jer ih sad salje u json formatu a nama post
                            //prima json

// Route middlewares
app.use('/api/user', authRoute);    // Ovo znaci da sve sto se poziva iz onog authRoute ce da ima navedeni prefix
app.use('/api/subjects', subjects);
app.use('/api/activities', activities);
app.use('/api/users/students', students);
app.use('/api/users/professors', professors);

// Povezi se s bazom (DB)
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB!')
);

const PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {res.send('armin')});

app.listen(PORT, () => console.log('Server Up and running!')); //ovo 3000 je zapravo port na kome se pokrece server

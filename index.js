"use strict";
const express = require('express');
var app = express();
// import handlebars and body-parser
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

let useSSL = false;
if (process.env.DATABASE_URL){
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/registrations';

const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({ 
    connectionString,
    ssl: useSSL
});

let Registrations = require('./js/registrations');
const registrations = Registrations(pool);

app.use(express.static('public'));
// handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        active: function() {
            if ( this.selected ) {
                return 'selected';
            }
        }
    }
}));

app.set('view engine', 'handlebars');

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'Deelowtrayne',
    resave: false,
    saveUninitialized: true
  }));

app.use(flash());


app.get("/", async function (req, res, next) {
    try {
        res.render('home', {
            regList: await registrations.all(),
            filterTowns: await registrations.tags()
        });
    } catch (err) {
        next(err);
    }
});

app.post("/add", async function (req, res, next) {
    try {
        let num = req.body.regNumber;
        await registrations.add(num);
        req.flash('newReg_alert', 'Added new registration number!');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

app.post("/towns/new", async function (req, res, next) {
    try {
        await registrations.addTown({
            name: req.body.townName,
            tag: req.body.townTag
        });
        req.flash('newTown_alert', 'Added new town!');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

app.get("/filter/:tag", async function (req, res, next) {
    try {
        let tag = req.params.tag;
        res.render('home', {
            regList : await registrations.filterBy(tag),
            filterTowns: await registrations.tags(tag)
        });
    } catch (err) {
        next(err);
    }
});

app.get("/filter/filter:tag", function(req, res){
    let tag = req.params.tag;
    res.redirect("/filter/" + tag);
});

app.listen(PORT, function () {
    console.log('Listening on port ', PORT);
});

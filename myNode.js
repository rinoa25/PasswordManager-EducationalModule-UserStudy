// Instantiates the following packages
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var sha256 = require('js-sha256');
var htmlspecialchars = require('locutus/php/strings/htmlspecialchars');
var handlebars = require('express3-handlebars').create();
var fs = require('fs');
var key;
var num = 0;

// Defining application to be express
var app = express ();

// Define handlebars template (only for index)
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Ensures form data gets parsed to JSON object properly
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// session and cookies
app.use(cookieParser('secret'));
app.use(session({
  cookie: {maxage: null},
  secret: 'cookie_secret',
  resave: true,
  saveUninitialized: true
}));

// Flash message middleware
app.use(function (req, res, next) {
  res.locals.message = req.session.message;
  delete req.session.message
  next();
});

// Includes the module mongodb
var MongoClient = require('mongodb').MongoClient
// Specifies the host name(address) / port number & we want to connect to
var url = "mongodb://localhost:27017/";

// Tells the client which database it should connect to
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db('S-PM');
});

// When localhost:8080 is visited, index.html will be rendered and shown;
// CSS & JS files will be sent to the browser as well
app.use(express.static(__dirname));

// Extracting key from key text file
fs.readFile('keyfile.txt', 'utf8', function(err, data) {
    if (err) throw err;
    key = data.replace(/\s/g, "");
});

// Getting index handlebars page
app.get('/', function (req, res) {
  res.render('index');
});

// index page post
app.post('/', function (req, res) {
  var wid = htmlspecialchars(req.body.workerid);
  var hid = sha256(wid + key);
  dbo.collection("info").findOne({"hashedid": hid}, function(err, result) {
    if (err) throw err;
    if (result) {
      req.session.message = {
        type: 'error',
        inputval: wid,
        message: 'User has already completed the process'
      }
      res.redirect('/');
    }
    else {
      num ++;
      req.session.message = {
        type: 'success',
        inputval: wid,
        message: 'User successfully authenticated',
        number: num
      }
      res.redirect('/');
    }
  });
});

// Handles POST request; ultimately stores parsed data in collection inside database
//req.body = all parsed info submitted by form
app.post('/datasubmission/', function(req, res) {
  console.log(req.originalUrl);
  var workerID = htmlspecialchars(req.body.workerID);
  var hashedID = sha256(workerID + key);
  var group = req.body.group;
  var signupOption = req.body.signupOption;
  var passPolicy = req.body.passPolicy;
  var randomPass = req.body.randomPass;
  var registeredPass = htmlspecialchars(req.body.registeredPass);
  var loginPass = htmlspecialchars(req.body.loginPass);
  var match = req.body.match;
  var agreed = req.body.agreed;
  var gender = req.body.workergender;
  var age = req.body.workerage;
  var education = req.body.workereducation;
  var language = req.body.finalLanguage;
  var area = req.body.finalArea;
  var trick = req.body.trick;
  var usedPM = req.body.usedpm;
  var understandTheory = req.body.understandtheory;
  var securePM = req.body.securepm;
  var futurePM = req.body.futurepm;
  var educationalModule = req.body.finalModule;
  var reason = htmlspecialchars(req.body.finalReason);
  // Defines a JS object that has all properties recieved from form data
  var newCredential= {hashedID: hashedID, group: group, signupOption: signupOption, passPolicy: passPolicy, randomPass: randomPass, registeredPass: registeredPass, loginPass: loginPass, match: match, agreed: agreed, gender: gender, age: age, education: education, language: language, area: area, trick: trick, usedPM: usedPM, understandTheory: understandTheory, securePM: securePM, futurePM: futurePM, educationalModule: educationalModule, reason: reason};
  dbo.collection("firstStudy").insertOne(newCredential, function(err, result) {
    if (err) throw err;
    console.log("1 set of credentials inserted for first study");
    res.redirect('/completed.html');
  });
});

// Constantly listening on the port 3003
app.listen(3003);

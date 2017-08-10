var mongoUrl = 'mongodb://localhost:27017/ATD04';
var mongoClient = require('mongodb').MongoClient, assert = require('assert');


mongoClient.connect(mongoUrl, function (error, db) {
    assert.equal(error, null);

    console.log("logged into mongo!");

    var express = require('express');
    var app = express();

    var bodyParser = require('body-parser');

    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    app.use(function (req, res, next) {
        console.log('got request: ' + req.protocol + '://' + req.get('host') + req.originalUrl);

        next();
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    app.get('/', function (req, res) {
        res.send('Hello World');
    })

    app.get('/index', function (req, res) {
        // TODO: Return index.html
    })

    var authService = require('./services/authenticationService.js').getService(db)
    var peopleService =  require('./services/peopleService.js').getService(db)
    var recipesService =  require('./services/recipesService.js').getService(db, peopleService)

    app.use('/authentification', require('./controllers/authentification.js').getRouter(authService));
    app.use('/people', require('./controllers/people.js').getRouter(peopleService));
    app.use('/recipes', require('./controllers/recipes.js').getRouter(recipesService));
    
    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Example app listening at http://%s:%s", host, port)
    })
});
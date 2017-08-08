var mongoUrl = 'mongodb://localhost:27017/ATD04';
var mongoClient = require('mongodb').MongoClient, assert = require('assert');


mongoClient.connect(mongoUrl, function (error, db) {
    assert.equal(error, null);

    console.log("logged into mongo!");

    var express = require('express');
    var app = express();

    var bodyParser = require('body-parser');
    var dbHandler = require('./dbHandler.js').dbHandler(db);

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

    app.get('/recipes/latest', function (req, res) {

        var requesterId = req.query.requesterId;

        dbHandler.getLatestRecipes(requesterId)
            .then(function (results) {
                res.send(results);
            });
    });

    app.get('/recipes/popular', function (req, res) {

        dbHandler.getPopularRecipes(requesterId)
            .then(function (results) {
                res.send(results);
            });
    });

    app.get('/recipes', function (req, res) {
        var nameToFind = req.query.name;

        dbHandler.searchRecipes(nameToFind)
            .then((results) => res.send(results));
    });

    app.get('/recipes/:id', function (req, res) {
        dbHandler.getRecipe(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    });

    app.get('/recipes/:id/likes', function (req, res) {
        dbHandler.getLikes(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    });

    app.get('/recipes/:id/comments', function (req, res) {
        dbHandler.getComments(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    });

    app.get('/people', function (req, res) {
        var nameToFind = req.query.name;

        dbHandler.searchPeople(nameToFind)
            .then((people) => { res.send(people) });
    });

    app.get('/people/:id', function (req, res) {
        dbHandler.getPerson(req.params['id'])
            .then(function (doc) {
                res.send(doc);
            });
    });

    app.get('/people/:id/follows', function (req, res) {
        dbHandler.getFollowees(req.params['id'])
            .then(function (followees) {
                res.send(followees);
            });

    });

    app.post('/people', function (req, res) {
        var user = {
            'name': req.body.name,
            'profilePicture': req.body.profilePicture,
        };

        dbHandler.insertPerson(user, function (err, result) {
            res.send(user._id)
        });
    });

    app.post('/recipes', function (req, res) {

        var recipe = req.body;

        dbHandler.postRecipe(recipe, (error, result) => {
            res.send(recipe._id);
        });
    });

    app.post('/recipes/:id/comments', function (req, res) {
        dbHandler.addComment(req.params['id'], req.body.author, req.body.content)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    })

    app.post('/recipes/:id/likes', function (req, res) {
        dbHandler.likeRecipe(req.params['id'], req.body.likerId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    })

    app.post('/people/:id/follows', function (req, res) {
        dbHandler.follow(req.params['id'], req.body.followeeId)
            .then((result) => {
                if (result == null)
                    res.sendStatus(404);
                else
                    res.send(result)
            });
    });

    app.delete('/people/:followerId/follows/:followeeId', function (req, res) {
        dbHandler.unfollow(req.params['followerId'], req.params['followeeId'])
            .then((result => res.send(result)));
    })

    app.delete('/recipes/:recipeId/likes/:likerId', function (req, res) {
        dbHandler.unlikeRecipe(req.params['recipeId'], req.params['likerId'])
            .then((result => res.send(result)));
    })

    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Example app listening at http://%s:%s", host, port)
    })
});



function Recipe(id, title, author, authorId, profilePicture, previewPicture, content) {
    this._id = id;
    this.title = title;
    this.author = author;
    this.authorId = authorId;
    this.profilePicture = profilePicture;
    this.previewPicture = previewPicture;
    this.content = content;
}


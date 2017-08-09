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

    app.get('/recipes', searchRecipes);
    app.get('/recipes/latest', getLatestRecipes);
    app.get('/recipes/popular', getPopularRecipes);

    app.get('/recipes/:id', getRecipeById);
    app.get('/recipes/:id/likes', getRecipeLikes);
    app.get('/recipes/:id/comments', getRecipeComments);

    app.post('/recipes', postRecipe);
    app.post('/recipes/:id/authors', addRecipeAuthor);
    app.post('/recipes/:id/comments', addRecipeComment);
    app.post('/recipes/:id/likes', likeRecipe);

    app.put('/recipes/:id/content', updateRecipeContent);

    app.delete('/recipes/:id', deleteRecipe);
    app.delete('/recipes/:recipeId/likes/:likerId', unlike);
    app.delete('/recipes/:recipeId/authors/:authorId', removeAuthor);



    app.get('/people', searchPeople);
    app.get('/people/popular', getPopularPeople);

    app.get('/people/:id', gerPersonById);
    app.get('/people/:id/follows', getFollowees);
    app.get('/people/:id/followers', getFollowers);

    app.post('/people', postPerson);
    app.post('/people/:id/follows', followPerson);

    app.delete('/people/:followerId/follows/:followeeId', unfollow);



    function getLatestRecipes(req, res) {
        var requesterId = req.query.requesterId;

        dbHandler.getLatestRecipes(requesterId)
            .then(function (results) {
                res.send(results);
            });
    }

    function getPopularRecipes(req, res) {
        dbHandler.getPopularRecipes()
            .then(function (results) {
                res.send(results);
            });
    }

    function searchRecipes(req, res) {
        var searchTerm = req.query.query;

        dbHandler.searchRecipes(searchTerm)
            .then((results) => res.send(results));
    }

    function getRecipeById(req, res) {
        dbHandler.getRecipe(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    }

    function getRecipeLikes(req, res) {
        dbHandler.getLikes(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    }

    function getRecipeComments(req, res) {
        dbHandler.getComments(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    }

    function searchPeople(req, res) {
        var nameToFind = req.query.name;

        dbHandler.searchPeople(nameToFind)
            .then((people) => { res.send(people) });
    }

    function getPopularPeople(req, res) {
        dbHandler.getPopularPeople()
            .then(function (results) {
                res.send(results);
            });
    }

    function gerPersonById(req, res) {
        dbHandler.getPerson(req.params['id'])
            .then(function (doc) {
                res.send(doc);
            });
    }

    function getFollowees(req, res) {
        dbHandler.getFollowees(req.params['id'])
            .then(function (followees) {
                res.send(followees);
            });

    }

    function getFollowers(req, res) {
        dbHandler.getFollowers(req.params['id'])
            .then(function (followers) {
                res.send(followers);
            });
    }

    function postPerson(req, res) {
        var user = {
            'name': req.body.name,
            'profilePicture': req.body.profilePicture,
        };

        dbHandler.insertPerson(user, function (err, result) {
            res.send(user._id)
        });
    }

    function postRecipe(req, res) {
        var recipe = req.body;

        dbHandler.postRecipe(recipe, (error, result) => {
            res.send(recipe._id);
        });
    }

    function addRecipeAuthor(req, res) {
        dbHandler.addRecipeAuthor(req.params['id'], req.body.authorId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    }

    function addRecipeComment(req, res) {
        dbHandler.addComment(req.params['id'], req.body.author, req.body.content)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    }

    function likeRecipe(req, res) {
        dbHandler.likeRecipe(req.params['id'], req.body.likerId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    }

    function followPerson(req, res) {
        dbHandler.follow(req.params['id'], req.body.followeeId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(204);
                else
                    res.sendStatus(501)
            });
    }

    function updateRecipeContent(req, res) {
        console.log(req.body.content);
        dbHandler.updateRecipe(req.params['id'], req.body.content)
            .then(result => {
                if (result == 1)
                    res.sendStatus(204)
                else
                    res.sendStatus(501)
            })
    }

    function deleteRecipe(req, res) {
        dbHandler.deleteRecipe(req.params['id'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(204)
                else
                    res.sendStatus(501)
            });

    }

    function unfollow(req, res) {
        dbHandler.unfollow(req.params['followerId'], req.params['followeeId'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.sendStatus(501)
            });
    }

    function unlike(req, res) {
        dbHandler.unlikeRecipe(req.params['recipeId'], req.params['likerId'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.sendStatus(501)
            });
    }

    function removeAuthor(req, res) {
        dbHandler.removeRecipeAuthor(req.params['recipeId'], req.params['authorId'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.send(result)
            });
    }


    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Example app listening at http://%s:%s", host, port)
    })
});
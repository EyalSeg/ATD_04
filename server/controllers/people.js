var express = require('express');

exports.getRouter = function (services) {
    var ctrl = new controller(services);
    var router = express.Router();

    router.get('/', ctrl.searchPeople);
    router.get('/popular', ctrl.getPopularPeople);

    router.get('/:id', ctrl.gerPersonById);
    router.get('/:id/follows', ctrl.getFollowees);
    router.get('/:id/followers', ctrl.getFollowers);
    router.get('/:id/recipes', ctrl.getPersonRecipes);


    router.post('', ctrl.postPerson);
    router.post('/:id/follows', ctrl.followPerson);

    router.delete('/:followerId/follows/:followeeId', ctrl.unfollow);

    return router;
}


function controller(services) {
    this.services = services;
    
    this.searchPeople = function (req, res) {
        var nameToFind = req.query.name;

        services['people'].searchPeople(nameToFind)
            .then((people) => { res.send(people) });
    }

    this.getPopularPeople = function (req, res) {
        services['people'].getPopularPeople()
            .then(function (results) {
                res.send(results);
            });
    }

    this.gerPersonById = function (req, res) {
        services['people'].getPerson(req.params['id'])
            .then(function (doc) {
                res.send(doc);
            });
    }

    this.getPersonRecipes = function(req, res){
        services['recipes'].getPersonRecipes(req.params['id'])
            .then(function (doc) {
                res.send(doc);
            });
    }


    this.getFollowees = function (req, res) {
        services['people'].getFollowees(req.params['id'])
            .then(function (followees) {
                res.send(followees);
            });

    }

    this.getFollowers = function (req, res) {
        services['people'].getFollowers(req.params['id'])
            .then(function (followers) {
                res.send(followers);
            });
    }

    this.postPerson = function (req, res) {
        var user = {
            'name': req.body.name,
            'profilePicture': req.body.profilePicture,
            'email': req.body.email.toLowerCase(),
            'password': req.body.password
        };

        services['people'].insertPerson(user, function (err, result) {
            if (err != null) {
                res.status(409).send(err.message);
            }
            else
                res.send(user._id)
        });
    }


    this.followPerson = function (req, res) {
        services['people'].follow(req.params['id'], req.body.followeeId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.sendStatus(501)
            });
    }


    this.unfollow = function (req, res) {
        services['people'].unfollow(req.params['followerId'], req.params['followeeId'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.sendStatus(501)
            });
    }
}






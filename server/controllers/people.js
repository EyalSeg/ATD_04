var express = require('express');

exports.getRouter = function (service) {
    var ctrl = new controller(service);
    var router = express.Router();

    router.get('/', ctrl.searchPeople);
    router.get('/popular', ctrl.getPopularPeople);

    router.get('/:id', ctrl.gerPersonById);
    router.get('/:id/follows', ctrl.getFollowees);
    router.get('/:id/followers', ctrl.getFollowers);

    router.post('', ctrl.postPerson);
    router.post('/:id/follows', ctrl.followPerson);

    router.delete('/:followerId/follows/:followeeId', ctrl.unfollow);

    return router;
}


function controller(service) {
    this.service = service;

    this.searchPeople = function (req, res) {
        var nameToFind = req.query.name;

        service.searchPeople(nameToFind)
            .then((people) => { res.send(people) });
    }

    this.getPopularPeople = function (req, res) {
        service.getPopularPeople()
            .then(function (results) {
                res.send(results);
            });
    }

    this.gerPersonById = function (req, res) {
        service.getPerson(req.params['id'])
            .then(function (doc) {
                res.send(doc);
            });
    }

    this.getFollowees = function (req, res) {
        service.getFollowees(req.params['id'])
            .then(function (followees) {
                res.send(followees);
            });

    }

    this.getFollowers = function (req, res) {
        service.getFollowers(req.params['id'])
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

        service.insertPerson(user, function (err, result) {
            res.send(user._id)
        });
    }


    this.followPerson = function (req, res) {
        service.follow(req.params['id'], req.body.followeeId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.sendStatus(501)
            });
    }


    this.unfollow = function (req, res) {
        service.unfollow(req.params['followerId'], req.params['followeeId'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.sendStatus(501)
            });
    }
}






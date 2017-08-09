var express = require('express');


exports.getRouter = function (service) {
    var ctrl = new controller(service);
    var router = express.Router();

    router.get('/', ctrl.searchRecipes);
    router.get('/latest', ctrl.getLatestRecipes);
    router.get('/popular', ctrl.getPopularRecipes);

    router.get('/:id', ctrl.getRecipeById);
    router.get('/:id/likes', ctrl.getRecipeLikes);
    router.get('/:id/comments', ctrl.getRecipeComments);

    router.post('/', ctrl.postRecipe);
    router.post('/:id/authors', ctrl.addRecipeAuthor);
    router.post('/:id/comments', ctrl.addRecipeComment);
    router.post('/:id/likes', ctrl.likeRecipe);

    router.put('/:id/content', ctrl.updateRecipeContent);

    router.delete('/:id', ctrl.deleteRecipe);
    router.delete('/:recipeId/likes/:likerId', ctrl.unlike);
    router.delete('/:recipeId/authors/:authorId', ctrl.removeAuthor);

    return router;
}

function controller(service) {
    this.service = service;


    this.getLatestRecipes = function (req, res) {
        var requesterId = req.query.requesterId;

        service.getLatestRecipes(requesterId)
            .then(function (results) {
                res.send(results);
            });
    }

    this.getPopularRecipes = function (req, res) {
        service.getPopularRecipes()
            .then(function (results) {
                res.send(results);
            });
    }

    this.searchRecipes = function (req, res) {
        var searchTerm = req.query.query;

        service.searchRecipes(searchTerm)
            .then((results) => res.send(results));
    }

    this.getRecipeById = function (req, res) {
        service.getRecipe(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    }

    this.getRecipeLikes = function (req, res) {
        service.getLikes(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    }

    this.getRecipeComments = function (req, res) {
        service.getComments(req.params['id'])
            .then((recipe) => { res.send(recipe) });
    }

    this.postRecipe = function (req, res) {
        var recipe = req.body;

        service.postRecipe(recipe, (error, result) => {
            console.log(result)
            res.send(result.insertedIds[0]);
        });
    }

    this.addRecipeAuthor = function (req, res) {
        service.addRecipeAuthor(req.params['id'], req.body.authorId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    }

    this.addRecipeComment = function (req, res) {
        service.addComment(req.params['id'], req.body.author, req.body.content)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    }

    this.likeRecipe = function (req, res) {
        service.likeRecipe(req.params['id'], req.body.likerId)
            .then((result) => {
                if (result == 1)
                    res.sendStatus(201);
                else
                    res.sendStatus(501);
            })
    }


    this.updateRecipeContent = function (req, res) {
        console.log(req.body.content);
        service.updateRecipe(req.params['id'], req.body.content)
            .then(result => {
                if (result == 1)
                    res.sendStatus(204)
                else
                    res.sendStatus(501)
            })
    }

    this.deleteRecipe = function (req, res) {
        service.deleteRecipe(req.params['id'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(204)
                else
                    res.sendStatus(501)
            });

    }


    this.unlike = function (req, res) {
        service.unlikeRecipe(req.params['recipeId'], req.params['likerId'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.sendStatus(501)
            });
    }

    this.removeAuthor = function (req, res) {
        service.removeRecipeAuthor(req.params['recipeId'], req.params['authorId'])
            .then((result) => {
                if (result == 1)
                    res.sendStatus(200);
                else
                    res.send(result)
            });
    }
}





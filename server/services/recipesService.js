function recipesService(db, peopleService) {
    require('./mongoService.js').mongoService.call(this, db);
    var ObjectId = this.ObjectId;

    this.people = peopleService;

    this.recipePreviewProjection = { 'title': 1, 'description': 1, 'authors': 1, 'previewPicture': 1, 'numOfComments': 1, 'creationDate': 1, 'numOfLikes': 1 };
    this.recipeProjection = { 'title': 1, 'description': 1, 'authors': 1, 'previewPicture': 1, 'numOfComments': 1, 'creationDate': 1, 'content': 1, 'numOfLikes': 1 }

    this.addRecipeFields =
        {
            '$addFields': {
                'numOfComments': { '$size': '$comments' },
                'numOfLikes': { '$size': '$likes' }
            }
        };

    var service = this;

    this.getRecipe = function (id) {
        return service.collection('recipes').aggregate([
            { '$match': { '_id': ObjectId(id) } },
            service.addRecipeFields,
            { '$project': service.recipeProjection }
        ])
            .limit(1).toArray().then((array) => array[0]);
    }

    this.addRecipeAuthor = function (recipeId, authorId) {
        return people.getPersonCard(authorId)
            .then((newAuthor) =>
                service.db.collection('recipes').update(
                    { '_id': ObjectId(recipeId) },
                    { '$addToSet': { 'authors': newAuthor } }
                )
            ).then((response) => { return JSON.parse(response).ok });
    }

    this.removeRecipeAuthor = function (recipeId, authorId) {
        return service.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$pull': { 'authors': { '_id': ObjectId(authorId) } } }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.updateRecipe = function (recipeId, newContent) {
        return service.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$set': { 'content': newContent } }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.deleteRecipe = function (recipeId) {
        return service.collection('recipes').remove(
            { '_id': ObjectId(recipeId) }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.searchRecipes = function (searchTerm) {
        var projection = service.recipePreviewProjection;
        projection['score'] = { '$meta': 'textScore' };

        return service.collection('recipes').aggregate([
            {
                '$match': {
                    '$text': {
                        '$search': searchTerm
                    }
                }
            },
            service.addRecipeFields,
            { '$project': projection },
            { '$sort': { score: { $meta: "textScore" } } }
        ]).toArray();
    }

    this.getLatestRecipes = function (requesterId) {
        return people.getFollowees(requesterId)
            .then(function (result) {

                followeeIds = result.follows.map((id) => ObjectId(id));

                return service.collection('recipes').aggregate([
                    {
                        '$match': {
                            'authors':
                            { '$elemMatch': { '_id': { '$in': followeeIds } } }
                        }
                    },
                    service.addRecipeFields,
                    { '$project': service.recipePreviewProjection },
                    { '$sort': { 'creationDate': -1 } }
                ]).toArray();
            })
    }

    this.getPopularRecipes = function () {
        return service.collection('recipes').aggregate([
            service.addRecipeFields,
            { '$project': service.recipePreviewProjection },
            { '$sort': { 'numOfLikes': -1 } }
        ]).toArray();;
    }

    this.getPersonRecipes = function (authorId) {
         return service.collection('recipes').aggregate([
            { '$match': { 'authors': { '$elemMatch': { '_id': ObjectId(authorId) } } } },
            service.addRecipeFields,
            { '$project': service.recipePreviewProjection },
        ]).toArray();;
    }

    this.postRecipe = function (recipe, callback) {
        authorIds = recipe.authors.map((author) => ObjectId(author));

        return service.people.getPeopleCards(authorIds).then((authors) => {
            recipe.comments = [];
            recipe.likes = [];
            recipe.authors = authors;
            recipe.creationDate = Date.now();

            return service.collection('recipes').insert(recipe, callback)
        });
    }

    this.likeRecipe = function (recipeId, likerId) {
        return service.db.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$addToSet': { 'likes': ObjectId(likerId) } }
        )
            .then((response) => { return JSON.parse(response).ok })
    }

    this.unlikeRecipe = function (recipeId, likerId) {
        return service.db.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$pull': { 'likes': ObjectId(likerId) } }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.getLikes = function (recipeId) {
        return service.collection('recipes').findOne(
            { '_id': ObjectId(recipeId) },
            { '_id': 0, 'likes': 1 })
            .then((result) => {
                var likeIds = result.likes.map((like) => ObjectId(like));

                return service.people.getPeople(likeIds);

            });
    }

    this.addComment = function (recipeId, authorId, content) {
        return service.people.getPersonCard(authorId)
            .then((author) => {
                var comment = {
                    'author': author,
                    'creationDate': Date.now(),
                    content: content
                };

                return service.collection('recipes').update(
                    { '_id': ObjectId(recipeId) },
                    { '$addToSet': { 'comments': comment } }
                ).then((response) => { return JSON.parse(response).ok });
            })
    }

    this.getComments = function (recipeId) {
        return service.collection('recipes').findOne(
            { '_id': ObjectId(recipeId) },
            { '_id': 0, 'comments': 1 })
            .then((obj) => obj.comments)
    }

}
exports.getService = function (db, peopleService) {
    return new recipesService(db, peopleService);
}

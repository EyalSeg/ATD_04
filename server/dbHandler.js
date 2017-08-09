var ObjectId = require('mongodb').ObjectId;


exports.dbHandler = function (db) {
    return new dbHandler(db);
};

function dbHandler(db) {
    this.db = db;
    this.collection = function (name) {
        return this.db.collection(name);
    }

    var handler = this;

    this.recipePreviewProjection = { 'title': 1, 'description': 1, 'authors': 1, 'previewPicture': 1, 'numOfComments': 1, 'creationDate': 1, 'numOfLikes': 1 };
    this.personPreviewProjection = { 'name': 1, 'profilePicture': 1, 'numOfFollows': 1, 'numOfFollowers': 1 };

    this.personProjection = { 'name': 1, 'profilePicture': 1, 'numOfFollows': 1, 'numOfFollowers': 1 };
    this.recipeProjection = { 'title': 1, 'description': 1, 'authors': 1, 'previewPicture': 1, 'numOfComments': 1, 'creationDate': 1, 'content': 1, 'numOfLikes': 1 }

    this.addPersonFields =
        { '$addFields': { 'numOfFollows': { '$size': '$follows' }, 'numOfFollowers': { '$size': '$followers' } } };
    this.addRecipeFields =
        {
            '$addFields': {
                'numOfComments': { '$size': '$comments' },
                'numOfLikes': { '$size': '$likes' }
            }
        };

    this.getPerson = function (id, projection = handler.personProjection) {
        return handler.collection('people').aggregate([
            { '$match': { '_id': ObjectId(id) } },
            handler.addPersonFields,
            { '$project': projection }
        ])
            .limit(1).toArray().then((array) => array[0]);
    }

    this.getPeople = function (ids, projection) {
        return handler.collection('people').aggregate([
            { '$match': { '_id': { '$in': ids } } },
            handler.addPersonFields,
            { '$project': projection }
        ])
            .toArray();
    }

    this.getFollowees = function (followerId) {
        return handler.collection('people').findOne(
            { '_id': ObjectId(followerId) },
            { '_id': 0, 'follows': 1 }
        )
            .then((results => {

                followeeIds = results.follows.map((id) => ObjectId(id));
                return handler.getPeople(followeeIds, handler.personPreviewProjection)
            }));
    }

    this.getFollowers = function (followeeId) {
        return handler.collection('people').findOne(
            { '_id': ObjectId(followeeId) },
            { '_id': 0, 'followers': 1 }
        )
            .then((results => {

                followerIds = results.followers.map((id) => ObjectId(id));
                return handler.getPeople(followerIds, handler.personPreviewProjection)
            }));
    }

    this.searchPeople = function (searchTerm) {
        var projection = handler.personPreviewProjection;
        projection['score'] = { '$meta': 'textScore' };

        return handler.collection('people').aggregate([
            {
                '$match': {
                    '$text': {
                        '$search': searchTerm
                    }
                }
            },
            handler.addPersonFields,
            { '$project': projection },
            { '$sort': { score: { $meta: "textScore" } } }
        ]).toArray();

    }

    this.insertPerson = function (person, callback) {
        person.follows = [];
        person.followers = [];

        handler.collection('people').insert(person, callback);
    }

    this.follow = function (followerId, followeeId) {
        return Promise.all([
            handler.collection('people').update(
                { '_id': ObjectId(followerId) },
                { '$addToSet': { 'follows': ObjectId(followeeId) } }
            ),
            handler.collection('people').update(
                { '_id': ObjectId(followeeId) },
                { '$addToSet': { 'followers': ObjectId(followerId) } }
            )
        ])
            .then((results) => {
                results = results.map((res) => JSON.parse(res).ok);

                if (results.some((res) => res != 1))
                    return 0

                return 1
            });

    }

    this.unfollow = function (followerId, followeeId) {
        return Promise.all([
            handler.db.collection('people').update(
                { '_id': ObjectId(followerId) },
                { '$pull': { 'follows': ObjectId(followeeId) } }),
            handler.db.collection('people').update(
                { '_id': ObjectId(followeeId) },
                { '$pull': { 'followers': ObjectId(followerId) } })
        ])
            .then((results) => {
                results = results.map((res) => JSON.parse(res).ok);

                if (results.some((res) => res != 1))
                    return 0

                return 1
            });
    }

    this.getPopularPeople = function () {
        return handler.collection('people').aggregate([
            handler.addPersonFields,
            { '$project': handler.personPreviewProjection },
            { '$sort': { 'numOfFollowers': -1 } }
        ]).toArray();;
    }

    this.getRecipe = function (id) {
        return handler.collection('recipes').aggregate([
            { '$match': { '_id': ObjectId(id) } },
            handler.addRecipeFields,
            { '$project': handler.recipeProjection }
        ])
            .limit(1).toArray().then((array) => array[0]);
    }

    this.addRecipeAuthor = function (recipeId, authorId) {
        console.log('author id is ' + authorId);
        return handler.getPerson(authorId, handler.personPreviewProjection)
            .then((newAuthor) =>
                handler.db.collection('recipes').update(
                    { '_id': ObjectId(recipeId) },
                    { '$addToSet': { 'authors': newAuthor } }
                )
            ).then((response) => { return JSON.parse(response).ok });
    }

    this.removeRecipeAuthor = function (recipeId, authorId) {
        return handler.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$pull': { 'authors': { '_id': ObjectId(authorId) } } }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.updateRecipe = function (recipeId, newContent) {
        return handler.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$set': { 'content': newContent } }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.deleteRecipe = function (recipeId) {
        return handler.collection('recipes').remove(
            { '_id': ObjectId(recipeId) }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.searchRecipes = function (searchTerm) {
        var projection = handler.recipePreviewProjection;
        projection['score'] = { '$meta': 'textScore' };

        return handler.collection('recipes').aggregate([
            {
                '$match': {
                    '$text': {
                        '$search': searchTerm
                    }
                }
            },
            handler.addRecipeFields,
            { '$project': projection },
            { '$sort': { score: { $meta: "textScore" } } }
        ]).toArray();
    }

    this.getLatestRecipes = function (requesterId) {
        return handler.collection('people').findOne(
            { '_id': ObjectId(requesterId) },
            { '_id': 0, 'follows': 1 }
        ).then(function (result) {

            followeeIds = result.follows.map((id) => ObjectId(id));

            return handler.collection('recipes').aggregate([
                {
                    '$match': {
                        'authors':
                        { '$elemMatch': { '_id': { '$in': followeeIds } } }
                    }
                },
                handler.addRecipeFields,
                { '$project': handler.recipePreviewProjection },
                { '$sort': { 'creationDate': -1 } }
            ]).toArray();
        })
    }

    this.getPopularRecipes = function () {
        return handler.collection('recipes').aggregate([
            handler.addRecipeFields,
            { '$project': handler.recipePreviewProjection },
            { '$sort': { 'numOfLikes': -1 } }
        ]).toArray();;
    }

    this.postRecipe = function (recipe, callback) {
        authorIds = recipe.authors.map((author) => ObjectId(author));

        handler.collection('people').find(
            { '_id': { '$in': authorIds } },
            handler.personPreviewProjection
        ).toArray().then((authors) => {
            recipe.comments = [];
            recipe.likes = [];
            recipe.authors = authors;
            recipe.creationDate = Date.now();

            handler.collection('recipes').insert(recipe, callback)
        });
    }

    this.likeRecipe = function (recipeId, likerId) {
        return handler.db.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$addToSet': { 'likes': ObjectId(likerId) } }
        )
            .then((response) => { return JSON.parse(response).ok })
    }

    this.unlikeRecipe = function (recipeId, likerId) {
        return handler.db.collection('recipes').update(
            { '_id': ObjectId(recipeId) },
            { '$pull': { 'likes': ObjectId(likerId) } }
        ).then((response) => { return JSON.parse(response).ok });
    }

    this.getLikes = function (recipeId) {
        return handler.collection('recipes').findOne(
            { '_id': ObjectId(recipeId) },
            { '_id': 0, 'likes': 1 })
            .then((result) => {
                var likeIds = result.likes.map((like) => ObjectId(like));

                return handler.getPeople(likeIds, handler.personPreviewProjection);

            });
    }

    this.addComment = function (recipeId, authorId, content) {
        return handler.getPerson(authorId, handler.personPreviewProjection)
            .then((author) => {
                var comment = {
                    'author': author,
                    'creationDate': Date.now(),
                    content: content
                };

                return handler.collection('recipes').update(
                    { '_id': ObjectId(recipeId) },
                    { '$addToSet': { 'comments': comment } }
                ).then((response) => { return JSON.parse(response).ok });
            })
    }

    this.getComments = function (recipeId) {
        return handler.collection('recipes').findOne(
            { '_id': ObjectId(recipeId) },
            { '_id': 0, 'comments': 1 })
            .then((obj) => obj.comments)
    }
    // this.getPerson = function (personId, projection) {
    //     var aggregationSteps = [
    //         { '$match': { '_id': ObjectId(personId) } },
    //         handler.addPersonFields
    //     ];

    //     //   if (projection != null)
    //     //     aggregationSteps.push({'$project': projection});

    //     return handler.db.collection('people').aggregate(aggregationSteps)
    //         .limit(1).toArray().then((resultsArray) => { return resultsArray[0] });
    // }

    // this.matchPeople = function (match, projection = handler.personPreviewProjection ) {
    //     return handler.db.collection('people').aggregate([
    //         { '$match': match },
    //         handler.addPersonFields,
    //         { '$project': projection }
    //     ]).toArray();
    // }

    // this.getPeople = function (ids, projection = handler.personPreviewProjection) {
    //     ids = ids.map((id) => { return ObjectId(id) });

    //     return handler.matchPeople({ '_id': { '$in': ids }, projection });
    // }

    // this.follow = function (followerId, followeeId) {
    //     return handler.db.collection('people').update(
    //         { '_id': ObjectId(followerId) },
    //         { '$addToSet': { 'follows': ObjectId(followeeId) } }
    //     )
    // };

    // this.unfollow = function (followerId, followeeId) {
    //     return handler.db.collection('people').update(
    //         { '_id': ObjectId(followerId) },
    //         { '$pull': { 'follows': ObjectId(followeeId) } }
    //     );
    // }

    // this.searchPeople = function (name, projection) {
    //     return handler.matchPeople({ 'name': name });
    // }

    // this.getFollowees = function (followerId, followeeProjection = handler.personPreviewProjection) {
    //     var projection = { '_id': 0, 'follows': 1 };

    //     return handler.db.collection('people').findOne(
    //         { '_id': ObjectId(followerId) },
    //         { '_id': 0, 'follows': 1 }
    //     )
    //         .then(function (result) {
    //             if (result == null)
    //                 return null;

    //             return handler.getPeople(result.follows, followeeProjection);
    //         });
    // }

    // this.getRecipe = function (id) {
    //     return handler.db.collection('recipes').aggregate([
    //         { '$match': { '_id': ObjectId(id) } },
    //         handler.addRecipeFields
    //     ]).limit(1).toArray().then((resultsArray) => { return resultsArray[0] });
    // }

    // this.matchRecipes = function (match) {
    //     return handler.db.collection('recipes').aggregate([
    //         { '$match': match },
    //         handler.addRecipeFields,
    //         { '$project': handler.recipePreviewProjection }
    //     ]).toArray();
    // }

    // this.searchRecipes = function (name) {
    //     return handler.matchRecipes({ 'name': name })
    // }

    // this.getRecipesByAuthors = function (authors, projection) {
    //     return handler.matchRecipes({
    //         'authors': {
    //             '$elemMatch': {
    //                 '_id': { '$in': authors }
    //             }

    //         }
    //     });
    // };

    // this.addComment = function (recipieId, commentorId, content) {
    //     return handler.getPerson(commentorId, handler.personPreviewProjection)
    //         .then((commentor) => {
    //             var comment = {
    //                 'author': commentor,
    //                 'creationDate': Date.now(),
    //                 'content': content
    //             };

    //             console.log(recipieId);

    //             return handler.db.collection('recipes').update(
    //                 { '_id': ObjectId(recipieId) },
    //                 { '$addToSet': { 'comments': comment } }
    //             ).then((response) => { return JSON.parse(response).ok });

    //         });
    // }

    // this.postRecipe = function (recipe, callback) {
    //     handler.getPeople(recipe.authors)
    //         .then(function (people) {
    //             recipe.comments = [];
    //             recipe.likes = [];
    //             recipe.authors = people;
    //             recipe.creationDate = Date.now();

    //             handler.db.collection('recipes').insert(recipe, callback)

    //         });
    // }

    // this.getLatestRecipes = function (requesterId) {
    //     return handler.getFollowees(requesterId, {'_id': 0, 'follows': 1})
    //         .then((followeeIds) => {
    //             return handler.getRecipesByAuthors(followeeIds, handler.recipePreviewProjection)
    //                 .sort({ 'creationDate': -1 }).toArray();
    //         });

    // }
}
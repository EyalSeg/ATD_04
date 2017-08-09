function peopleService(db) {
    require('./mongoService.js').mongoService.call(this, db);
    var ObjectId = this.ObjectId;
    
    this.personPreviewProjection = { 'name': 1, 'profilePicture': 1, 'numOfFollows': 1, 'numOfFollowers': 1 };
    this.personProjection = { 'name': 1, 'profilePicture': 1, 'numOfFollows': 1, 'numOfFollowers': 1 };

    this.addPersonFields =
        { '$addFields': { 'numOfFollows': { '$size': '$follows' }, 'numOfFollowers': { '$size': '$followers' } } };

    var service = this;

   this.getPerson = function (id, projection = handler.personProjection) {
        return service.collection('people').aggregate([
            { '$match': { '_id': ObjectId(id) } },
            service.addPersonFields,
            { '$project': projection }
        ])
            .limit(1).toArray().then((array) => array[0]);
    }

    this.getPersonPreview = function(id){
        return service.getPerson(id, service.personPreviewProjection);
    }

    this.getPeople = function (ids, projection = service.personPreviewProjection) {
        return service.collection('people').aggregate([
            { '$match': { '_id': { '$in': ids } } },
            service.addPersonFields,
            { '$project': projection }
        ])
            .toArray();
    }

    this.getFollowees = function (followerId) {
        return service.collection('people').findOne(
            { '_id': ObjectId(followerId) },
            { '_id': 0, 'follows': 1 }
        )
            .then((results => {

                followeeIds = results.follows.map((id) => ObjectId(id));
                return service.getPeople(followeeIds, service.personPreviewProjection)
            }));
    }

    this.getFollowers = function (followeeId) {
        return service.collection('people').findOne(
            { '_id': ObjectId(followeeId) },
            { '_id': 0, 'followers': 1 }
        )
            .then((results => {

                followerIds = results.followers.map((id) => ObjectId(id));
                return service.getPeople(followerIds, service.personPreviewProjection)
            }));
    }

    this.searchPeople = function (searchTerm) {
        var projection = service.personPreviewProjection;
        projection['score'] = { '$meta': 'textScore' };

        return service.collection('people').aggregate([
            {
                '$match': {
                    '$text': {
                        '$search': searchTerm
                    }
                }
            },
            service.addPersonFields,
            { '$project': projection },
            { '$sort': { score: { $meta: "textScore" } } }
        ]).toArray();

    }

    this.insertPerson = function (person, callback) {
        person.follows = [];
        person.followers = [];

        service.collection('people').insert(person, callback);
    }

    this.follow = function (followerId, followeeId) {
        return Promise.all([
            service.collection('people').update(
                { '_id': ObjectId(followerId) },
                { '$addToSet': { 'follows': ObjectId(followeeId) } }
            ),
            service.collection('people').update(
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
            service.db.collection('people').update(
                { '_id': ObjectId(followerId) },
                { '$pull': { 'follows': ObjectId(followeeId) } }),
            service.db.collection('people').update(
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
        return service.collection('people').aggregate([
            service.addPersonFields,
            { '$project': service.personPreviewProjection },
            { '$sort': { 'numOfFollowers': -1 } }
        ]).toArray();;
    }

}

exports.getService = function (db) {
    return new peopleService(db);
}


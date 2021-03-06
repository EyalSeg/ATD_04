function peopleService(db) {
    require('./mongoService.js').mongoService.call(this, db);
    var ObjectId = this.ObjectId;

    this.personCardProjection = { 'name': 1, 'profilePicture': 1 };
    this.personPreviewProjection = { 'name': 1, 'profilePicture': 1, 'numOfFollows': 1, 'numOfFollowers': 1 };
    this.personProjection = { 'name': 1, 'profilePicture': 1, 'numOfFollows': 1, 'numOfFollowers': 1 };

    this.addPersonFields =
        { '$addFields': { 'numOfFollows': { '$size': '$follows' }, 'numOfFollowers': { '$size': '$followers' } } };

    var service = this;

    this.getPerson = function (id, projection = service.personProjection) {
        return service.collection('people').aggregate([
            { '$match': { '_id': ObjectId(id) } },
            service.addPersonFields,
            { '$project': projection }
        ])
            .limit(1).toArray().then((array) => array[0]);
    }

    this.getPersonPreview = function (id) {
        return service.getPerson(id, service.personPreviewProjection);
    }

    this.getPersonCard = function (id) {
        return service.collection('people').find(
            { '_id': ObjectId(id) },
            service.personCardProjection
        ).toArray().then((array) => { return array[0] });
    }

    this.getPeople = function (ids, projection = service.personPreviewProjection) {
        return service.collection('people').aggregate([
            { '$match': { '_id': { '$in': ids } } },
            service.addPersonFields,
            { '$project': projection }
        ])
            .toArray();
    }

    this.getPeopleCards = function (ids) {
        return service.collection('people').find(
            { '_id': { '$in': ids } },
            service.personCardProjection)
            .toArray();
    }

    this.getFollowees = function (followerId) {
        return service.getFolloweeIds(followerId).then((ids) => {
            ids = ids.map((id) => ObjectId(id));
            return service.getPeople(ids, service.personPreviewProjection)

        })
    }

    this.getFolloweeIds = function (followerId) {
        return service.collection('people').findOne(
            { '_id': ObjectId(followerId) },
            { '_id': 0, 'follows': 1 }
        )
            .then((results => {
                console.log('found ' + results.follows + ' followees')
                return results.follows;
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

    this.hasFollowee = function (followerId, followeeId) {
        return service.getFolloweeIds(followerId)
        .then((ids) =>{
            return ids.some((id) => id == followeeId)})
    }

    this.searchPeople = function (searchTerm) {
        var projection = { 'name': 1, 'profilePicture': 1, 'numOfFollows': 1, 'numOfFollowers': 1 };
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
            //{ '$sort': { 'numOfFollowers': -1 } }
        ]).sort({ 'numOfFollowers': -1 }).toArray();;
    }

}

exports.getService = function (db) {
    return new peopleService(db);
}


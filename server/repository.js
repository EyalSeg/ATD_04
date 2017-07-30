function repository(mongoUrl) {
    var mongoClient = require('mongodb').MongoClient,
        assert = require('assert');


    var db = mongoClient.connect(mongoUrl, function (error, db) {
        assert.equal(error, null);

        console.log("logged into mongo!");
    });
};


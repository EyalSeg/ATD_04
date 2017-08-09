function mongoService(db){
    this.db = db;
    this.collection = function(name){
        return this.db.collection(name);
    }
    
    var objectId = require('mongodb').ObjectId;
    this.ObjectId = function(id){ return objectId(id)};
}

exports.mongoService = mongoService;
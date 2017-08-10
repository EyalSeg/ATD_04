function authenticationService(db) {
    require('./mongoService.js').mongoService.call(this, db);

    var service = this;    

    this.login = function (email, password) {
        return service.collection('people').find({
            'email': email.toLowerCase(),
            'password': password
        },
            { '_id': 1 })
            .toArray().then((resultsArray) =>{
                if (resultsArray.length == 1)
                    return resultsArray[0];
                else
                    return null;
            })
    }
}

exports.getService = function (db) {
    return new authenticationService(db);
}


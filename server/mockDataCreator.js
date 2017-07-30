var mongoUrl = 'mongodb://localhost:27017/ATD04';
var mongoClient = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectId;

var people = [];

people.push(new Person('597e2f469996a853288419df',
    "Sarah",
    'https://s-media-cache-ak0.pinimg.com/736x/a2/e1/8c/a2e18cbfbcaa8756fe5b40f472eeff45--profile-picture-profile-pics.jpg',
    'https://www.chef-lavan.co.il/uploads/f_57f4c1be84abd_1475658174.jpg',
    6));

people.push(new Person('597e2f469996a853288419e0',
    "Suzanne",
    'https://s-media-cache-ak0.pinimg.com/736x/3e/b8/f9/3eb8f9632af1b0702f15f99a01ce7135--black-and-white-sketches-black-and-white-doodles.jpg',
    'http://www.nrg.co.il/images/archive/465x349/1/443/159.jpg',
    6));

var repository = mongoClient.connect(mongoUrl, function (error, db) {
    assert.equal(error, null);

    console.log("logged into mongo!");
    db.dropDatabase();

    db.close();
});

var repository = mongoClient.connect(mongoUrl, function (error, db) {
    assert.equal(error, null);

    console.log("logged into mongo!");
    db.collection('people').insertMany(people, function(err, result){});

    db.close();
});

function Recipe(id, title, author, authorId, profilePicture, previewPicture, content) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.authorId = authorId;
    this.profilePicture = profilePicture;
    this.previewPicture = previewPicture;
    this.content = content;
}

function Person(id, name, profilePicture, followers, follows) {
    this._id = ObjectId(id);
    this.name = name;
    this.profilePicture = profilePicture;
    this.followers = followers;
    this.follows = follows;
}
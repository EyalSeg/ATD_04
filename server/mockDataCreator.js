var http = require('http');
var serverUri = 'localhost';
var port = 8081;

var createNewPerson = function (personToCreate) {
    return new Promise((resolve, reject) => {
        var options = {
            'hostname': serverUri,
            'port': port,
            'path': '/people',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            }
        };

        var request = http.request(options, function (response) {
            response.on('data', function (data) {
                id = JSON.parse(data);
                console.log('created person! name: ' + personToCreate.name + ' id: ' + id);
                personToCreate._id = id;

                resolve(personToCreate);
            });
        });

        request.write(JSON.stringify(personToCreate));
        request.end();

    })

};

var follow = function (follower, followee) {
    return new Promise((resolve, reject) => {
        var options = {
            'hostname': serverUri,
            'port': port,
            'path': '/people/' + follower._id + "/follows",
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            }
        };

        var request = http.request(options, function (response) {
            response.on('data', function (data) {
                console.log(follower.name + ' now follows ' + followee.name);

                resolve('success');
            });
        });

        var data = { 'followeeId': followee._id.toString() };
        console.log(JSON.stringify(data));
        request.write(JSON.stringify(data));
        request.end();
    })
};

var sarah = new Person('Sarah',
    'https://s-media-cache-ak0.pinimg.com/736x/a2/e1/8c/a2e18cbfbcaa8756fe5b40f472eeff45--profile-picture-profile-pics.jpg');

var suzanne = new Person('Suzanne',
    'https://s-media-cache-ak0.pinimg.com/736x/3e/b8/f9/3eb8f9632af1b0702f15f99a01ce7135--black-and-white-sketches-black-and-white-doodles.jpg');

var john = new Person('John Doe',
    'http://img13.deviantart.net/1043/i/2015/121/6/b/new_id_by_crisvector-d2vqia1.png');

var alice = new Person('Alice',
    'https://s-media-cache-ak0.pinimg.com/736x/07/dd/12/07dd1283d19211a46dbbb29ec4483fe8--drawings-faces-girl-art-drawings.jpg');

var jessica = new Person('Jessica',
    "https://s-media-cache-ak0.pinimg.com/236x/46/14/f7/4614f73916868602adf0d531e9cd31f1.jpg");

Promise.all([
    createNewPerson(sarah),
    createNewPerson(john),
    createNewPerson(suzanne),
    createNewPerson(alice),
    createNewPerson(jessica)
])

.then((people) => {
    var sarah = people[0], john = people[1], suzanne = people[2], alice = people[3], jessica = people[4];

    follow(sarah, john)
    .then(follow(sarah, suzanne))
    .then(follow(sarah, alice))
    .then(follow(sarah, jessica))

    .then(follow(john, suzanne))
    .then(follow(john, jessica))

    .then(follow(suzanne, john))
    .then(follow(suzanne, alice))

    .then(follow(alice, sarah))
    .then(follow(alice, john))

    .then(follow(jessica, john))
    
    // DUPLICATES to make sure nothing happens
    .then(follow(sarah, john))
    .then(follow(sarah, suzanne))
    .then(follow(sarah, alice))
    .then(follow(sarah, jessica))
    
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

function Person(name, profilePicture) {
    this.name = name;
    this.profilePicture = profilePicture;
}
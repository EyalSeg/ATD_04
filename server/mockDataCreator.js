var http = require('http');
var serverUri = 'localhost';
var port = 8081;

var STAYYEB = function (stiyyub) {
    console.log(stiyyub);
}

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
        // console.log(JSON.stringify(data));
        request.write(JSON.stringify(data));
        request.end();
    })
};

var postRecipe = function (recipe) {
    return new Promise((resolve, reject) => {
        var options = {
            'hostname': serverUri,
            'port': port,
            'path': '/recipes',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            }
        };

        var request = http.request(options, function (response) {
            response.on('data', function (data) {
                id = JSON.parse(data);

                recipe._id = id;
                console.log('created recipe! id: ' + id);

                resolve(recipe);
            });
        });

        request.write(JSON.stringify(recipe));
        request.end();
    });
};

var comment = function (recipeId, commentorId, content) {
    return new Promise((resolve, reject) => {
        var options = {
            'hostname': serverUri,
            'port': port,
            'path': '/recipes/' + recipeId + "/comments",
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            }
        };

        var request = http.request(options, function (response) {
            response.on('data', function (data) {
                console.log('comment posted');

                resolve('success');
            });
        });

        var data = { 'author': commentorId, 'content': content };
        // console.log(JSON.stringify(data));
        request.write(JSON.stringify(data));
        request.end();
    })
};

var like = function (recipeId, likerId) {
    return new Promise((resolve, reject) => {
        var options = {
            'hostname': serverUri,
            'port': port,
            'path': '/recipes/' + recipeId + "/likes",
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            }
        };

        var request = http.request(options, function (response) {
            response.on('data', function (data) {
                console.log('like posted');

                resolve('success');
            });
        });

        var data = { 'likerId': likerId };
        // console.log(JSON.stringify(data));
        request.write(JSON.stringify(data));
        request.end();
    })
};

var sarah = new Person('Sarah',
    'https://s-media-cache-ak0.pinimg.com/736x/a2/e1/8c/a2e18cbfbcaa8756fe5b40f472eeff45--profile-picture-profile-pics.jpg');

var suzanne = new Person('Suzanne',
    'https://s-media-cache-ak0.pinimg.com/736x/3e/b8/f9/3eb8f9632af1b0702f15f99a01ce7135--black-and-white-sketches-black-and-white-doodles.jpg');

var john = new Person('John Doe',
    'http://img13.deviantart.net/1043/i/h2015/121/6/b/new_id_by_crisvector-d2vqia1.png');

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
        var recipes = [
            new Recipe(
                "אמא שלך בלאפה",
                "כזאת ביג. עם אומלט.",
                [sarah._id, alice._id],
                ['אמא שלך', 'לאפה', 'ביצים'],
                'https://www.mishlohim.co.il/img/menu/Product_pic338647.jpg',
                ['קח את אמא שלך, שים בלאפה כזאת ביג. להגיש עם אומלט.']),
            new Recipe(
                "קיש אחותך",
                "נחש מה? היא גם צולעת?",
                [john._id],
                ['אחותך', 'קמח', 'ביצים'],
                'http://images1.ynet.co.il/xnet//PicServer2/pic/052014/524437/1_7.jpg',
                ['אתה יודע למה אחותך צולעת? נחש.'])
        ];


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

            .then(Promise.all(recipes.map((recipe) => { return postRecipe(recipe) }))
                .then((recipes) => {
                    comment(recipes[0]._id, suzanne._id, "Looks great!")
                        .then(() => { comment(recipes[0]._id, jessica._id, "YUMM") })
                        .then(() => { comment(recipes[1]._id, alice._id, "I want to try that") })
                        .then(() => { like(recipes[0]._id, sarah._id) })
                        .then(() => { like(recipes[1]._id, sarah._id) })
                        .then(() => { like(recipes[0]._id, jessica._id) })
                        .then(() => { like(recipes[0]._id, john._id) })
                        .then(() => { like(recipes[1]._id, john._id) })
                        .then(() => { like(recipes[1]._id, suzanne._id) })
                        .then(() => { like(recipes[1]._id, alice._id) })
                }));



    });


function Recipe(title, description, authors, ingredients, previewPicture, content) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.ingredients = ingredients;
    this.previewPicture = previewPicture;
    this.content = content;
}

function Person(name, profilePicture) {
    this.name = name;
    this.profilePicture = profilePicture;
}
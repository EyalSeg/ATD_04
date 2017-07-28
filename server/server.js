var express = require('express');
var app = express();


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/recipes', function (req, res) {
    var recipes = [];

    recipes.push(new Recipe(
        1,
        'אמא שלך בלאפה',
        'Sarah',
        '234',
        'https://s-media-cache-ak0.pinimg.com/736x/3e/b8/f9/3eb8f9632af1b0702f15f99a01ce7135--black-and-white-sketches-black-and-white-doodles.jpg',
        'http://www.nrg.co.il/images/archive/465x349/1/443/159.jpg',
        'כזאת ביג. עם אומלט'));

    recipes.push(new Recipe(
        2,
        'קיש אחותך',
        'Sally Doe',
        '7456',
        'https://s-media-cache-ak0.pinimg.com/736x/a2/e1/8c/a2e18cbfbcaa8756fe5b40f472eeff45--profile-picture-profile-pics.jpg',
        'https://www.chef-lavan.co.il/uploads/f_57f4c1be84abd_1475658174.jpg',
        'נחשו מה? היא גם צולעת.'));

        var results = {}; 
        results['recipes'] = recipes;

    res.send(results);
})

app.get('/recipes/:id', function (req, res) {
    res.send({
        'id': req.params['id'],
        'title': 'פסאדו מתכון',
        'author': "james",
        'authorId': '23',
        'profilePicture': "https://s-media-cache-ak0.pinimg.com/736x/3e/b8/f9/3eb8f9632af1b0702f15f99a01ce7135--black-and-white-sketches-black-and-white-doodles.jpg",
        'content': "לך חפש"
    });
});

app.get('/people', function (req, res) {
    var people = [];

    people.push(new Person(1,
        req.query.name,
        'https://s-media-cache-ak0.pinimg.com/736x/a2/e1/8c/a2e18cbfbcaa8756fe5b40f472eeff45--profile-picture-profile-pics.jpg',
        'https://www.chef-lavan.co.il/uploads/f_57f4c1be84abd_1475658174.jpg',
        6));

    people.push(new Person(2,
        req.query.name,
         'https://s-media-cache-ak0.pinimg.com/736x/3e/b8/f9/3eb8f9632af1b0702f15f99a01ce7135--black-and-white-sketches-black-and-white-doodles.jpg',
        'http://www.nrg.co.il/images/archive/465x349/1/443/159.jpg',
        6));

        var results = {};
        results['people'] = people;
    res.send(results);
});

app.get('/people/:id', function(req, res){
    res.send({
        'id': req.params['id'],
        'name': 'Person ' + req.params['id'],
        'profilePicture' :'https://s-media-cache-ak0.pinimg.com/736x/a2/e1/8c/a2e18cbfbcaa8756fe5b40f472eeff45--profile-picture-profile-pics.jpg',
        'subscribers' : 12,
        'follows': 3
    });

});


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})


function Recipe(id, title, author, authorId, profilePicture, previewPicture, content) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.authorId = authorId;
    this.profilePicture = profilePicture;
    this.previewPicture = previewPicture;
    this.content = content;
}

function Person(id, name, profilePicture, followers) {
    this.id = id;
    this.name = name;
    this.profilePicture = profilePicture;
    this.followers = followers;
}
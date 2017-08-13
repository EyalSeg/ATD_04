
var app = angular.module('main', ['textAngular', "ngRoute"]);



app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
        template : "<h1>Main</h1><p>Click on the links to change this content</p>"
    })
        .when("/banana", {
        template : "<h1>Banana</h1><p>Bananas contain around 75% water.</p>"
    })
        .when("/signIn", {
        templateUrl : "./Views/signIn.html",
        controller : 'signInController',
        controllerAs : 'controller'
    })
        .when("/people/:personId", {
        templateUrl : "./Views/profile.html",
        controller : 'profileController',
        controllerAs : 'controller'
    })

        .when("/people/:personId/follows", {
        template: '<search-results people="controller.followees">',
        controller: function($scope, $routeParams, apiService){

            var that = this;
            var personId = $routeParams.personId
            this.followees = {}

            apiService.getFollowees(personId).then((results) => {
                that.followees = results});

        },
        controllerAs:'controller'
    })
        .when("/people/:personId/followers", {
        template: '<search-results people="controller.followers">',
        controller: function($scope, $routeParams, apiService){

            var that = this;
            var personId = $routeParams.personId
            this.followees = {}

            apiService.getFollowers(personId).then((results) => {
                that.followers = results});

        },
        controllerAs:'controller'
    })
    
        .when("/recipes/:recipeId", {
        templateUrl : "./Views/recipe.html",
        controller : 'recipeController',
        controllerAs : 'controller'
    }) 
        .when("/recipes/:recipeId/likes", {
        template: '<search-results people="controller.likes">',
        controller: function($scope, $routeParams, apiService){

            var that = this;
            var recipeId = $routeParams.recipeId
            this.followees = {}

            apiService.getLikes(recipeId).then((results) => {
                that.likes = results});

        },
        controllerAs:'controller'
    })
    
    
        .when("/feed/popular", {
        template: '<search-results people="controller.people" recipes="controller.recipes">',
        controller: function($scope, apiService){

            var that = this;
            apiService.getPopularPeople().then((results) => {
                that.people = results});
            apiService.getPopularRecipes().then((results) => {
                console.log(results)
                that.recipes = results});
        },
        controllerAs:'controller'
    })
})
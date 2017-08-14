
var app = angular.module('main', ['textAngular', "ngRoute"]);



app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
        templateUrl : "./Views/signIn.html",
        controller : 'SignInController',
        controllerAs : 'SignInController'
    })

        .when("/entrance/:personId", {
        templateUrl : "./Views/entrance.html",
        controller : 'EntranceController',
        controllerAs : 'EntranceController'
    })
        .when("/people/:personId", {
        templateUrl : "./Views/profile.html",
        controller : 'profileController',
        controllerAs : 'ProfileController'
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
    .when("/people/:personId/recipes", {
        template: '<search-results recipes="controller.recipes">',
        controller: function($scope, $routeParams, apiService){

            var that = this;
            var personId = $routeParams.personId
            this.recipes = {}

            apiService.getRecipesById(personId).then((results) => {
                that.recipes = results});

        },
        controllerAs:'controller'
    })
        .when("/recipes/:recipeId", {
        templateUrl : "./Views/recipe.html",
        controller : 'RecipeController',
        controllerAs : 'RecipeController'
    })
    
    .when("/recipes/:recipeId/likes", {
        template: '<search-results people="controller.likes">',
        controller: function($scope, $routeParams, apiService){

            var that = this;
            var recipeId = $routeParams.recipeId
            this.likes = {}

            apiService.getLikes(recipeId).then((results) => {
                that.likes = results});

        },
        controllerAs:'controller'
        
    }) .when("/recipes/:recipeId/authors", {
        template: '<search-results people="controller.authors">',
        controller: function($scope, $routeParams, apiService){

            var that = this;
            var recipeId = $routeParams.recipeId
            this.authors = {}

            apiService.getRecipeAuthors(recipeId).then((results) => {
                that.authors = results});

        },
        controllerAs:'controller'
    })

        .when('/search', {
        template: '<search-results people="controller.people" recipes="controller.recipes">',
        controller: function($scope, $routeParams, apiService){

            var that = this;
            var query = $routeParams.query;
            this.recipes = {};
            this.people = {};

            apiService.getPeople(query).then((results) => {
                that.people = results});   
            apiService.getRecipes(query).then((results) => {
                                alert(results)

                that.recipes = results});
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
                that.recipes = results});
        },
        controllerAs:'controller'
    })
     .when("/feed/latest", {
        template: '<search-results recipes="controller.recipes">',
        controller: function($scope, apiService, activeUserService){
            
            this.recipes = {};
            var that = this;
            apiService.getLatestRecipes(activeUserService.activeUserId).then((results) => {
                that.recipes = results});
        },
        controllerAs:'controller'
    });
});

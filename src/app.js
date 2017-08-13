
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

        .when("/recipes/:recipeId", {
        templateUrl : "./Views/recipe.html",
        controller : 'recipeController',
        controllerAs : 'controller'
    })

    /** .when('feed/popular', {
        template: '{{contoller.people}}<search-results people="controller.people" recipes="contolller.recipes">',
        controller : ['$scope', 'apiService', function($scope, apiService){
            var that = this;
            console.log('got here');

            apiService.getPopularPeople().then((results) => {
                that.people = results});
            apiService.getPopularRecipes().then((results) => {that.recipes = results});
        }],
        controllerAs: 'controller'
    })**/

        .when("/feed/popular", {
        template: '<search-results people="controller.people" recipes="controller.recipes">',
        controller: function($scope, apiService){
            console.log('got here!!');

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
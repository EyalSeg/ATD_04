
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
        controllerAs : 'singIncontroller'
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
    });
});

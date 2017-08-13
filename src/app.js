
var app = angular.module('main', ['textAngular', "ngRoute"]);



app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
         templateUrl : "./Views/signIn.html",
        controller : 'SignInController',
        controllerAs : 'SignInController'
    })
    .when("/banana", {
        templateUrl : "<h1>Banana</h1><p>Bananas contain around 75% water.</p>"
    })
        .when("/editRecipe/:personId", {
            templateUrl : "./Views/editRecipe.html",
            controller : 'EditRecipeController',
            controllerAs : 'EditRecipeController'
        })

        .when("/addRecipe/:personId", {
            templateUrl : "./Views/addRecipe.html",
            controller : 'AddRecipeController',
            controllerAs : 'AddRecipeController'
        })

        .when("/entrance/:personId", {
            templateUrl : "./Views/entrance.html",
            controller : 'EntranceController',
            controllerAs : 'EntranceController'
        })
    .when("/people/:personId", {
        templateUrl : "./Views/profile.html",
        controller : 'profileController',
        controllerAs : 'controller'
    })
    
    .when("/recipes/:recipeId", {
        templateUrl : "./Views/recipe.html",
        controller : 'RecipeController',
        controllerAs : 'RecipeController'
    });
});

app.controller('AddRecipeController', function($scope, $rootScope,$routeParams, apiService){
     var that = this;
    var id = $routeParams.personId;
    apiService.getPerson(id).then(function (response) {
        $scope.currentUser = response.data;
        $scope.currentUser.id = id;
    });

    $scope.newRecipe = {
        'title': null,
        'description': null,
        'authors': null,
        'ingredients': null,
        'previewPicture': null,
        'content': null
    };


    this.submit = function () {
        $scope.newRecipe.authors = [$scope.currentUser.id._id];
        $scope.newRecipe.ingredients = [$scope.newRecipe.ingredients];
        apiService.postRecipe($scope.newRecipe).then(function (response) {
        });
        $rootScope.currentUser.id= $scope.newRecipe;
    };

});

app.directive('recipe', function () {
    return {
        restrict: 'E',
        templateUrl: './Views/recipe.html',
        scope: {
            recipe: '='
        }
    };
});


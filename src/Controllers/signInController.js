app.controller('signInController', function($scope,$routeParams, apiService){
     var that = this;
    var id = $routeParams.recipeId;


    this.setCurrentPerson = function (recipe) {
        $scope.currentPerson = recipe;
    };
    this.createNewPerson = function () {
        if ($scope.newUser.profilePicture != null) {
            apiService.postPerson($scope.newUser).then(function (response) {
                $scope.currentUser = $scope.newUser;
                $scope.currentUser.myRecipes = null;
            });
        }
    };
});
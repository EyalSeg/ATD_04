app.controller('EntranceController', function($scope, $rootScope, $routeParams,$location, apiService){
     var that = this;
    var id = $routeParams.personId;
    apiService.getPerson(id).then(function (response) {
        $scope.currentUser = response.data;
        $scope.currentUser.id = id;
    });

    this.goAddRecipe= function()
    {
        if( $scope.currentUser!=undefined) {
            var earl = '/addRecipe/' + $scope.currentUser.id;
            $location.url(earl);
        }
    };

});
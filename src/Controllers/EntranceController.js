app.controller('entranceController', function($scope,$routeParams, apiService){
     var that = this;
    var id = $routeParams.currentUserId;
    $scope.currentUser= apiService.gerPersonById(id);

});
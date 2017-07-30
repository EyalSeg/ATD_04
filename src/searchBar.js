app.directive('searchBar', function(){
    return {
        restrict: 'E', 
        templateUrl: 'searchBar.html',
        scope: {
            results:'=results'
        },
        controller: ['$scope', '$timeout', 'apiService', function($scope, $timeout, apiService){


            this.search = function(){
                $scope.results = {};

                apiService.getPeople(this.searchQuery).then(function(response){
                    console.log('found ' + response.data.length + ' people');
                    $scope.results.people = response.data;
                });

                apiService.getRecipes(this.searchQuery).then(function(response){
                    $scope.results.recipes = response.data;
                });
            };

            this.searchQuery = "";

        }],
        controllerAs: 'searchCtrl'
    } 
});
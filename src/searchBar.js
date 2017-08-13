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
                    $scope.results.people = response.data;
                });

                apiService.getRecipes(this.searchQuery).then(function(response){
                    $scope.results.recipes = response.data;
                });
            };
            
            this.getLatest = function(){
                 $scope.results = {};


                var requesterId = $scope.currentUser.id;
                apiService.getLatestRecipes(requesterId).then(function(response){
                    $scope.results.recipes = response.data;
                });
            }
            
            this.getPopular = function(){
                 $scope.results = {};

                apiService.getPopularPeople().then(function(response){
                    $scope.results.people = response.data;
                });

                apiService.getPopularRecipes().then(function(response){
                    $scope.results.recipes = response.data;
                });
            }

            this.searchQuery = "";

        }],
        controllerAs: 'searchCtrl'
    } 
});
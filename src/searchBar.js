app.directive('searchBar', function(){
    return {
        restrict: 'E', 
        templateUrl: 'searchBar.html',
        scope: {
            results:'=results'
        },
        controller: ['$scope', '$timeout', 'apiService', function($scope, $timeout, apiService){

            this.search = function(){
                switch(this.searchMode.toLowerCase()){
                    case 'people':
                        this.searchPeople(this.searchQuery);
                        break;
                    case 'recipes':
                        this.searchRecipes(this.searchQuery);
                        break;
                };
            };

            this.loadResults = function(promise){
                $timeout(
                    promise.then(function(response){
                        $scope.results = response.data;
                    })
                );
            };

            this.loadDefaultFeed = function(){
                this.loadResults(apiService.getRecipes());
            }

            this.searchRecipes = function(query){
                this.loadResults(apiService.getRecipes(query));
            }

            this.searchPeople = function(query){
                this.loadResults(apiService.getPeople(query));

            }


            this.searchMode = 'latest';
            this.searchQuery = "";

            this.loadDefaultFeed();


        }],
        controllerAs: 'searchCtrl'
    } 
});
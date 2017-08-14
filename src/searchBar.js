app.directive('searchBar', function(){
    return {
        restrict: 'E', 
        templateUrl: 'searchBar.html',
        scope: {
            results:'=results'
        },
        controller: ['$scope', '$timeout', '$location', 'apiService','activeUserService', function($scope, $timeout, $location, apiService, activeUserService){


            this.search = function(){
                $location.path('search/'+ this.searchQuery)
            };

            this.getLatest = function(){
                $location.path('feed/latest')
            }

            this.getPopular = function(){
                alert('got here')
                $location.path('feed/popular')

            }

            this.searchQuery = "";

        }],
        controllerAs: 'searchCtrl'
    } 
});
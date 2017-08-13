app.directive('searchResults', function () {
    return {
        restrict: 'E',
        templateUrl: 'Directives/searchResults.html',
        scope: {
            recipes: '=',
            people: '=',
        }  ,
        controller: function($location){
            this.gotoPerson = function(id){
                $location.path('people/' + id)
            }
            
            this.gotoRecipe = function(id){
                $location.path('recipes/' + id)
            }
        },
        controllerAs: 'controller'
    }
});

app.directive('searchResults', function () {
    return {
        restrict: 'E',
        templateUrl: 'Directives/searchResults.html',
        scope: {
            recipes: '=',
            people: '=',
        }      
    }
});

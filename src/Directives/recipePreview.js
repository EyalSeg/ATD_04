
app.directive('recipePreview', function () {
    return {
        restrict: 'E',
        templateUrl: 'Directives/recipePreivew.html',
        scope: {
            recipe: '=',
        }
    }
});

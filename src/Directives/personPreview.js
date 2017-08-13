
app.directive('personPreview', function () {
    return {
        restrict: 'E',
        templateUrl: 'Directives/personPreview.html',
        scope: {
            people: '=',
        }
    }
});

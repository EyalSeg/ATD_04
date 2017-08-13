
app.directive('peopleList', function () {
    return {
        restrict: 'E',
        templateUrl: 'peopleList.html',
        scope: {
            people: '='
        }
    }


});

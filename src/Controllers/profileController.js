    app.controller('profileController', function($scope, $routeParams, apiService)
    {
        var that = this;
        var id = $routeParams.personId;

        apiService.getPerson(id).then((results) => {
            that.profile = results;

        });
    });
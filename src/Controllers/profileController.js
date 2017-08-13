app.controller('profileController', function($scope, $routeParams, apiService){
    var that = this;
    var id = $routeParams.personId;
    this.followers = {};


    apiService.getPerson(id).then((results) => {
        that.profile = results;

    });

    apiService.getFollowers(that.id)
        .then((results) => {that.followers = results});  
});




app.controller('profileController', function($scope, $routeParams, apiService)
{
    var that = this;
    var id = $routeParams.personId;
    console.log(id);
    
    apiService.getPerson(id).then((results) => {
        that.name = results.name;
        that.profilePicture = results.profilePicture;
        that.numOfFollows = results.numOfFollows;
        that.numOfFollowers = results.numOfFollowers;
        
    });
});
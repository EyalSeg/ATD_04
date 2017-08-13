app.controller('profileController', function($scope, $routeParams, $location, apiService){
    var that = this;
    this.id = $routeParams.personId;


    apiService.getPerson(this.id).then((results) => {
        that.profile = results;

    });

    this.showFollowees = function(){
        $location.path('/people/'+this.id+'/follows')
    }
});




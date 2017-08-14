app.controller('profileController', function($scope, $routeParams, $location, apiService, activeUserService){
    var that = this;
    this.id = $routeParams.personId;
    this.isFollowed = false;
    this.isSelf = this.id == activeUserService.activeUserId;

    this.checkIsFollowed = function(){
        apiService.hasFollowee(activeUserService.activeUserId, that.id)
            .then((result) => that.isFollowed = result) 
    }
    this.checkIsFollowed();


    apiService.getPerson(this.id).then((results) => {
        that.profile = results;
    });

    this.showFollowees = function(){
        $location.path('/people/'+this.id+'/follows')
    }
    this.showFollowers = function(){
        $location.path('/people/'+this.id+'/followers')
    }
    this.showRecipes = function(){
        $location.path('/people/'+this.id+'/recipes')
    }
    
    this.follow = function(){
        apiService.follow(activeUserService.activeUserId, that.id)
        .then((result) => {that.checkIsFollowed()})
    }
    
    this.unfollow = function(){
        apiService.unfollow(activeUserService.activeUserId, that.id)
        .then((result) => {that.checkIsFollowed()})
    }

});




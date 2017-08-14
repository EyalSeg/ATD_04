app.controller('SignInController', function($scope, $routeParams,  $location, apiService, activeUserService){
    this.mode = "login";
    this.toggleText = "log in";
    $scope.newUser=null;
    $scope.currentUser=null;

    this.toggle = function(){
        if (this.mode =='login'){
            this.mode == 'register'
            this.toggleText = 'log in';
        }
        else if (this.mode == 'register'){
            this.mode == "login";
            this.toggleText = 'register';
        }
    };

    this.createNewPerson = function () {
        if ($scope.newUser.profilePicture != null) {
            apiService.postPerson($scope.newUser).then(function (response) {
                if (response.ok){
                    activeUserService.activeUserId = response.id;
                    $location.path('feed/popular')
                }
                else{
                    alert('error!')
                    //TODO 
                }

            })
        }};
    this.signIn = function () {
        apiService.signIn($scope.signInUser.email, $scope.signInUser.password).then(function (response) {
            alert(response)
            if (response.ok){
                alert(response)
                activeUserService.activeUserId = response.id;
                $location.path('feed/latest')
            }
            else{
                alert('error!')
                //TODO 
            }

        });

    };

});
             
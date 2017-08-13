app.controller('SignInController', function($scope, $rootScope, $routeParams,  $location, apiService){
    this.mode = "login";
    this.toggleText = "log in";
    $scope.newUser=null;
    $scope.currentUser=null;
    $rootScope=
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
        if ($rootScope.newUser.profilePicture != null) {
            apiService.postPerson($rootScope.newUser).then(function (response) {
                $rootScope.currentUser = $rootScope.newUser;
                $rootScope.currentUser.id=response.data;
                if( $scope.currentUser!=undefined) {
                    var earl = '/entrance.html/' + $rootScope.currentUser.id;
                    $location.url(earl);
                }
            });

        }
    };
    this.signIn = function () {

        apiService.signIn($rootScope.signInUser.email, $rootScope.signInUser.password).then(function (response) {
            var id = response.data;
            apiService.getPerson(id._id).then(function (response) {
                $rootScope.currentUser = response.data;
                $rootScope.currentUser.id = id._id;
                if( $rootScope.currentUser!=undefined) {
                    var earl = '/entrance/' + $rootScope.currentUser.id;
                    $location.url(earl);
                }
                });
            });

    };

});
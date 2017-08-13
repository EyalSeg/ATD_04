app.controller('SignInController', function($scope, $routeParams,  $location, apiService){
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
                $scope.currentUser = $scope.newUser;
                $scope.currentUser.id=response.data;
                if( $scope.currentUser!=undefined) {
                    var earl = '/entrance.html/' + $scope.currentUser.id;
                    $location.url(earl);
                }
            });

        }
    };
    this.signIn = function () {

        apiService.signIn($scope.signInUser.email, $scope.signInUser.password).then(function (response) {
            var id = response.data;
            apiService.getPerson(id._id).then(function (response) {
                $scope.currentUser = response.data;
                $scope.currentUser.id = id._id;
                if( $scope.currentUser!=undefined) {
                    var earl = '/entrance.html/' + $scope.currentUser.id;
                    $location.url(earl);
                }
                });
            });

    };

});
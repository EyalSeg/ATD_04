app.controller('SignInController', function ($scope, $rootScope, $routeParams, $location, apiService) {
    this.mode = "login";
    this.toggleText = "log in";
    $scope.newUser = null;
    $rootScope.currentUser = null;
    $rootScope =
        this.toggle = function () {
            if (this.mode == 'login') {
                this.mode == 'register'
                this.toggleText = 'log in';
            }
            else if (this.mode == 'register') {
                this.mode == "login";
                this.toggleText = 'register';
            }
        };

    this.createNewPerson = function () {
        if ($scope.newUser.profilePicture != null) {
            apiService.postPerson($scope.newUser).then(function (response) {
                $rootScope.currentUser = $scope.newUser;
                if ($rootScope.currentUser != undefined) {
                    $rootScope.currentUser.id = response.data;
                    var earl = '/entrance/' + $rootScope.currentUser.id;
                    $location.url(earl);
                }
            });

        }
    };
    this.signIn = function () {

        apiService.signIn($scope.signInUser.email, $scope.signInUser.password).then(function (response) {
            var id = response.data;
            apiService.getPerson(id._id).then(function (response) {
                $rootScope.currentUser = response;
                if ($rootScope.currentUser != undefined) {
                    $rootScope.currentUser.id = id._id;
                    var earl = '/entrance/' + $rootScope.currentUser.id;
                    $location.url(earl);
                }
            });
        });

    };

});
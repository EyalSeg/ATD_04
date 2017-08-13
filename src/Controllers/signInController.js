app.controller('signInController', function($scope, $routeParams, apiService){
    this.mode = "login";
    this.toggleText = "register"

    this.toggle = function(){
        if (this.mode =='login'){
            this.mode == 'register'
            this.toggleText = 'log in';
        }
        else if (this.mode == 'register'){
            this.mode == "login";
            this.toggleText = 'register';
        }
    } 

});
    
app.directive('tabs', function(){
    return {
        restrict: 'E', 
        templateUrl: 'tabs.html',
        scope: {
        },
        controller: ['$scope','$location', 'activeUserService', function($scope,   $location, activeUserService){

            this.goAddRecipe= function()
            {
                if(activeUserService!=undefined) {
                    var earl = '/addRecipe/' + activeUserService.activeUserId;
                    $location.url(earl);
                }
            };
        }],
        controllerAs: 'tabsCtrl'
    } 
});
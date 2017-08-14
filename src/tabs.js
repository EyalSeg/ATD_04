app.directive('tabs', function(){
    return {
        restrict: 'E', 
        templateUrl: 'tabs.html',
        scope: {
        },
        controller: ['$scope','$location', 'activeUserService', function($scope,   $location, activeUserService){

            this.query = "";
            
            this.goAddRecipe= function()
            {
                if(activeUserService!=undefined) {
                    var earl = '/addRecipe/' + activeUserService.activeUserId;
                    $location.url(earl);
                }
            };

        //    this.gotoSearch() = function(){
        //        alert('search ' + this.query)
        //        $location.path('/search?query=' + this.query);
         //   };
        }],
        controllerAs: 'tabsCtrl'
    } 
});
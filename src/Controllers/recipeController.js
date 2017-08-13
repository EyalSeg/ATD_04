app.controller('recipeController', function($scope,$routeParams, apiService){
     var that = this;
    var id = $routeParams.recipeId;
    
    apiService.getRecipe(id).then((results) => {
        that.recipe = results;
        
    });
});
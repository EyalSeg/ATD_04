app.controller('recipeController', function($scope,$routeParams,$location, apiService){
    var that = this;
    this.id = $routeParams.recipeId;

    apiService.getRecipe(this.id).then((results) => {
        that.recipe = results;

    });

    this.showLikes = function()
    {
          $location.path('/recipes/'+this.id+'/likes')
    }
});
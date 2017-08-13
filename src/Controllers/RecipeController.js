app.controller('RecipeController', function($scope,$routeParams, apiService){
     var that = this;
    var id = $routeParams.recipeId;
    
    apiService.getRecipe(id).then((results) => {
        that.recipe = results;
        
    });

    this.isAuthor =function()
    {};

    this.editRecipe= function()
    {};
});
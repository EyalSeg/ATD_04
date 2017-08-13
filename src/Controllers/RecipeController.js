app.controller('RecipeController', function($scope,$routeParams, $location, apiService){
    var that = this;
    this.id = $routeParams.recipeId;
    this.comments = {};

    this.loadComments = function(){
        apiService.getComments(this.id).then((response) =>{
            that.comments = response});
    };
    apiService.getRecipe(this.id).then((results) => {
        that.recipe = results;
    });

    this.loadComments();

    this.gotoLikes = function(){
        $location.path('recipes/'+this.id + '/likes')
    }


});
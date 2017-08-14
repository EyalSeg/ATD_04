
app.controller('RecipeController', function($scope,$routeParams, $location, apiService, activeUserService){
    var that = this;
    this.id = $routeParams.recipeId;

    this.comments = {};
    this.commentText = "";

    this.isAuthor = false;
    this.liked = false;

    this.loadComments = function(){
        apiService.getComments(this.id).then((response) =>{
            that.comments = response});
    };
    apiService.getRecipe(this.id).then((results) => {
        that.recipe = results;
    });

    apiService.recipeHasAuthor(this.id, activeUserService.activeUserId)
        .then((res) => that.isAuthor = res);

    apiService.recipeHasLike(this.id, activeUserService.activeUserId)
        .then((res) => {
        that.liked = res})

    this.gotoAuthors = function(){
        $location.path('/recipes/'+this.id+'/authors')
    }

    this.loadComments();

    this.gotoLikes = function(){
        $location.path('recipes/'+this.id + '/likes')
    }

    this.postComment = function(){

        apiService.postComment(this.recipe._id, activeUserService.activeUserId, this.commentText)
            .then((response) =>{
            if (response.ok)
                this.loadComments();
        })

        this.commentText = "";
    }

    this.edit= function()
    {
        $location.path('recipes/'+this.id + '/edit');
    }

    this.like = function(){
        apiService.like(this.recipe._id, activeUserService.activeUserId)
            .then((res) =>{
            apiService.recipeHasLike(this.id, activeUserService.activeUserId)
                .then((res) => that.liked = res)
        })
    }

    this.unlike = function(){
        apiService.unlike(this.recipe._id, activeUserService.activeUserId, this.commentText)
            .then((res) =>{
            apiService.recipeHasLike(this.id, activeUserService.activeUserId)
                .then((res) => that.liked = res)
        })
    }




});
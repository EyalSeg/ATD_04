app.service('apiService', ['$http', function($http) {
    this.serverUrl = 'http://localhost:8081/';

    this.getItem = function(itemType, itemId){
        switch(itemType.toLowerCase())  {
            case 'recipe' : return this.getRecipe(itemId);
            case 'person': return this.getPerson(itemId);
        }
    };

    this.getRecipes = function(name){
        var query = 'recipes';
        if (name != '')
            query += '?query=' + name;

        return $http.get(this.serverUrl + query).then((res) => {return res.data});
    };

    this.getLatestRecipes = function(requesterId){
        return $http.get(this.serverUrl + 'recipes/latest?requesterId=' + requesterId)
            .then((res) => {return res.data});
    }

    this.getRecipe = function(id){
        return $http.get(this.serverUrl + 'recipes/' + id).
        then((response) => {return response.data});
    };

    this.getRecipeOld = function(id){
        return $http.get(this.serverUrl + 'recipes/' + id);
    };

    this.postRecipe= function(recipe){
        return $http.post(this.serverUrl + 'recipes/',recipe);
    };
    this.getPeople = function(name){
        return $http.get(this.serverUrl + "people?name=" + name).then((res) => {return res.data});
    };

    this.getPopularPeople = function()
    {
        return $http.get(this.serverUrl + "people/popular/" ).then((res) => {return res.data});
    };
    this.getPopularRecipes = function()
    {
        return $http.get(this.serverUrl + "recipes/popular/" ).then((res) => {return res.data});
    };

    this.postPerson= function(user)
    {
        return $http.post(this.serverUrl + "people/" , user ).then((res) => {
            if (res.data != undefined)
                return {'ok': true, 'id':res.data}
                else
                    return {'ok':false}
                    });;
    };

    this.signIn= function(email, password)
    {
        return $http.post(this.serverUrl + "authentification/login/" ,{'email':email , 'password':password})
            .then((res) => {
            alert(res)
            if (res.data != undefined)
                return {'ok': true, 'id':res.data._id}
                else
                    return {'ok':false}
                    });
    };

    this.getPerson= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id ).then((res) => {return res.data});

    };

    this.getFollowees=function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/follows/").then((res) => {return res.data});

    };
    
    this.hasFollowee = function(followerId, followeeId){
        return $http.head(this.serverUrl + "people/"+followerId+"/follows/"+followeeId)
        .then((response) => {return response.status == 200})

    }
    this.getFollowers=function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/followers/").then((res) => {return res.data});
    };

    this.follow= function(id, followId)
    {
        return $http.post(this.serverUrl + "people/"+id+"/follows/",{'followeeId':followId});
    }
    
    this.unfollow= function(id, followId)
    {
        return $http.delete(this.serverUrl + "people/"+id+"/follows/"+ followId);
    }

    this.getLikes= function(id)
    {
        return $http.get(this.serverUrl + "recipes/"+id+"/likes").then((res) => {return res.data});
    }
    
    this.like = function(recipeId, likerId){
         return $http.post(this.serverUrl + "recipes/"+recipeId+"/likes", {likerId: likerId}).then((res) => {return res.status});
    }
    
    this.unlike = function(recipeId, likerId){
        return   $http.delete(this.serverUrl + "recipes/"+recipeId+"/likes/" + likerId).then((res) => {return res.status});
    }
    
    this.getRecipesById= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/recipes/").then((res) => {return res.data});
    }


    this.gerPersonById= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id);
    }

    this.updateRecipe=function(id, cont)
    {
        return $http.put(this.serverUrl + "recipes/"+id+"/content/",{'content':cont});
    }

    this.getComments=function(recipeId)
    {
        return $http.get(this.serverUrl + "recipes/"+recipeId+"/comments/").then((result) => {return result.data})
    }
    this.postComment=function(recipeId, authorId, content)
    {
        return $http.post(this.serverUrl + "recipes/"+recipeId+"/comments/", 
                          {'author':authorId, 'content':content})
            .then((result) => {return {'ok': result.status == 201}})
    }

    this.getRecipeAuthors = function(recipeId){
        return this.getRecipe(recipeId).then((recipe) => {return recipe.authors})
    }

    this.recipeHasAuthor = function(recipeId, authorId){
        return $http.head(this.serverUrl + 'recipes/' + recipeId + '/authors/' + authorId)
            .then((response) => {return response.status == 200})
    } 
    this.recipeHasLike = function(recipeId, likerId){
        return $http.head(this.serverUrl + 'recipes/' + recipeId + '/likes/' + likerId)
            .then((response) => {return response.status == 200})
    }
}]);
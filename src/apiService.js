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

        return $http.get(this.serverUrl + query);
    };
    
    this.getLatestRecipes = function(requesterId){
        return $http.get(this.serverUrl + 'recipes/latest?requesterId=' + requesterId);
    }

    this.getRecipe = function(id){
        return $http.get(this.serverUrl + 'recipes/' + id).
        then((response) => {return response.data});
    };

    this.postRecipe= function(recipe){
        return $http.post(this.serverUrl + 'recipes/',recipe);
    };
    this.getPeople = function(name){
        return $http.get(this.serverUrl + "people?name=" + name);
    };

    this.getPopularPeople = function()
    {
        return $http.get(this.serverUrl + "people/popular/" );
    };
    this.getPopularRecipes = function()
    {
        return $http.get(this.serverUrl + "recipes/popular/" );
    };

    this.postPerson= function(user)
    {
        return $http.post(this.serverUrl + "people/" , user );
    };

    this.signIn= function(email, password)
    {
        return $http.post(this.serverUrl + "authentification/login/" ,{'email':email , 'password':password});
    };

    this.getPerson= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id )
            .then((response) => {return response.data});
    };

    this.getFollowees=function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/follows/");

    };
    this.getFollowers=function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/followers/");
    };

    this.follow= function(id, followId)
    {
        return $http.post(this.serverUrl + "people/"+id+"/follows/",{'followeeid':followId});
    }

    this.getLikes= function(id)
    {
        return $http.get(this.serverUrl + "recipes/"+id+"/likes/");
    }
    this.getRecipesById= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/recipes/");
    }

    this.updateRecipe=function(id, cont)
    {
        return $http.put(this.serverUrl + "recipes/"+id+"/content/",{'content':cont});
    }
}]);
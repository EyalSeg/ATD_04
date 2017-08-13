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
        return $http.post(this.serverUrl + "people/" , user );
    };

    this.signIn= function(email, password)
    {
        return $http.post(this.serverUrl + "authentification/login/" ,{'email':email , 'password':password});
    };

    this.getPerson= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id );

    };

    this.getFollowees=function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/follows/").then((res) => {return res.data});

    };
    this.getFollowers=function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/followers/").then((res) => {return res.data});
    };

    this.follow= function(id, followId)
    {
        return $http.post(this.serverUrl + "people/"+id+"/follows/",{'followeeid':followId});
    }

    this.getLikes= function(id)
    {
        return $http.get(this.serverUrl + "recipes/"+id+"/likes/").then((res) => {return res.data});
    }
    this.getRecipesById= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id+"/recipes/");
    }
    this.gerPersonById= function(id)
    {
        return $http.get(this.serverUrl + "people/"+id);
    }

    this.updateRecipe=function(id, cont)
    {
        return $http.put(this.serverUrl + "recipes/"+id+"/content/",{'content':cont});
    }
}]);
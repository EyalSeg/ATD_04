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
            query += '?name=' + name;

        return $http.get(this.serverUrl + query);
    };

    this.getRecipe = function(id){
        return $http.get(this.serverUrl + 'recipes/' + id);
    };

    this.getPeople = function(name){
        return $http.get(this.serverUrl + "people?name=" + name);
    };

    this.getPerson = function(id)
    {
        return $http.get(this.serverUrl + "people/" + id);
    };
    this.getPopularPeople = function()
    {
        return $http.get(this.serverUrl + "people/popular/" );
    };
    this.getPopularRecipes = function()
    {
        return $http.get(this.serverUrl + "recipes/popular/" );
    };
}]);
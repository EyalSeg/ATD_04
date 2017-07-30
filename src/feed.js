app.directive('feed', function(){
    return {
        restrict: 'E',
        templateUrl: 'feed.html',
        controller: ['$scope', 'apiService', function($scope, apiService){

            var that = this; // HURR DURR
            this.items = [];
            this.selectedItem = null;
            this.selectedItemType = null;
            this.mode = 'recipes';

            this.selectedPerson = null;

            this.selectItem = function(itemId, itemType){

                apiService.getItem(itemType, itemId)
                    .then(function(response){
                    if (itemType.toLowerCase() == 'person')
                    {
                        that.selectedPerson = response.data;
                    }
                    else
                    {
                        that.selectedItem = response.data;
                        that.selectedItemType = itemType;
                        that.selectItem(response.data.authorId, 'person');
                    }

                });

            };

            this.deselectItem = function()
            {
                this.selectedItem = null;
                this.selectedItemType = null;
            };

        }],
        controllerAs: 'feed'
    };
});

app.directive('recipePreview', function(){
    return {
        restrict: 'E',
        templateUrl: 'recipePreview.html',
        scope: {
            recipe:'=recipe'
        }
    };
});

app.directive('personPreview', function(){
    return {
        restrict: 'E',
        templateUrl: 'personPreview.html',
        scope: {
            person:'=person'
        }
    };
});

app.directive('recipe', function(){
    return {
        restrict: 'E',
        templateUrl: 'recipe.html',
        scope: {
            recipe:'=',
            onDeselect: '&onDeselect'
        }
    };
});

app.directive('person', function(){
    return{
        restrict: 'E',
        templateUrl: 'person.html',
        scope:{
            person: '='
        }

    };
});


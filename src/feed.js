app.directive('feed', function () {
    return {
        restrict: 'E',
        templateUrl: 'feed.html',
        controller: ['$scope', 'apiService', function ($scope, apiService) {
            this.mode = "login";
            this.toggleText = "register"

            this.toggle = function(){
                if (this.mode =='login'){
                    this.mode == 'register'
                    this.toggleText = 'log in';
                }
                else if (this.mode == 'register'){
                    this.mode == "login";
                    this.toggleText = 'register';
                }
            }


            var that = this; // HURR DURR
            this.items = [];
            this.selectedItem = null;
            this.selectedItemType = null;
            this.mode = 'recipes';
            this.editorShow = false;
            this.menuShow = false;
            $scope.popularPeople = null;
            $scope.popularRecipes = null;
            this.selectedPerson = null;
            $scope.currentUser = null;
            $scope.signInUser = {
                'email': null,
                'password': null
            };
            $scope.newUser = {
                'name': null,
                'profilePicture': null,
                'email': null,
                'password': null
            };

            $scope.newRecipe = {
                'title': null,
                'description': null,
                'authors': null,
                'ingredients': null,
                'previewPicture': null,
                'content': null
            };
            this.profileShow = false;
            recipeClicked = false;
            $scope.currentRecipe = null;
            personClicked = false;
            $scope.currentPersonClicked = null;
            this.getProfile = false;
            $scope.showSubmit = false;
            this.showMyRecipies = false;
            this.editRecipe = false;
            this.showContent = false;

            this.setCurrentRecipe = function (recipe) {
                $scope.currentRecipe = recipe;
            };

            this.setCurrentPersonClicked = function (recipe) {
                $scope.currentPersonClicked = recipe;
                $scope.currentRecipe.liked=false;
            };
            this.createNewPerson = function () {
                if ($scope.newUser.profilePicture != null) {
                    apiService.postPerson($scope.newUser).then(function (response) {
                        $scope.currentUser = $scope.newUser;
                        $scope.currentUser.myRecipes = null;
                    });
                }
            };
            this.getFollowees = function () {
                apiService.getFollowees($scope.currentUser.id).then(function (response) {
                    $scope.currentUser.follows = response.data;
                });

            };
            this.getFollowers = function () {
                apiService.getFollowers($scope.currentUser.id).then(function (response) {
                    $scope.currentUser.followers = response.data;
                });

            };
            this.follow = function (person) {
                apiService.follow($scope.currentUser.id, person._id).then(function (response) {
                    apiService.getFollowees($scope.currentUser.id).then(function (response) {
                        $scope.currentUser.follows = response.data;
                    });
                });

            };

            this.signIn = function () {

                apiService.signIn($scope.signInUser.email, $scope.signInUser.password).then(function (response) {
                    var id = response.data;
                    apiService.getPerson(id).then(function (response) {
                        $scope.currentUser = response.data;
                        $scope.currentUser.id = id;
                        apiService.getFollowees($scope.currentUser.id).then(function (response) {
                            $scope.currentUser.follows = response.data;
                        });
                    });
                });

            };

            this.isNotFollowed = function (person) {
                if ($scope.currentUser != null) {
                    if ($scope.currentUser.follows != undefined) {
                        for (i = 0; i < $scope.currentUser.follows.length; i++) {
                            if ($scope.currentUser.follows[i]._id == person._id)
                                return false;
                        }
                        return true;
                    }
                    return false;
                }
                return false;
            };


            this.selectItem = function (itemId, itemType) {

                apiService.getItem(itemType, itemId)
                    .then(function (response) {
                        if (itemType.toLowerCase() == 'person') {
                            that.selectedPerson = response.data;
                        }
                        else {
                            that.selectedItem = response.data;
                            that.selectedItemType = itemType;
                            that.selectItem(response.data.authorId, 'person');
                        }

                    });

            };

            this.isLiked = function () {
                var likes = null;
                if ($scope.currentRecipe != undefined) {
                        apiService.getLikes($scope.currentRecipe._id)
                            .then(function (response) {
                                likes = response.data;
                                if(likes!=null) {
                                    for (i = 0; i < likes.length; i++) {
                                        if (likes[i]._id == $scope.currentUser.id)
                                         $scope.currentRecipe.liked=true;
                                    }
                                }
                            });
                    }

            };

            this.getUserRecipes = function () {
                apiService.getRecipesById($scope.currentUser.id).then(function (response) {
                    $scope.currentUser.myRecipes = response.data;
                });
            };

            this.getPopularPeople = function () {

                apiService.getPopularPeople()
                    .then(function (response) {
                        if (response.data != null)
                            $scope.popularPeople = response.data;
                    });

            };
            this.getPopularRecipes = function () {

                apiService.getPopularRecipes()
                    .then(function (response) {
                        if (response.data != null)
                            $scope.popularRecipes = response.data;
                    });

            };
            this.deselectItem = function () {
                this.selectedItem = null;
                this.selectedItemType = null;
            };
            this.getPopularPeople();
            this.getPopularRecipes();

            this.submit = function () {
                $scope.newRecipe.authors = [$scope.currentUser.id._id];
                $scope.newRecipe.ingredients = [$scope.newRecipe.ingredients];
                apiService.postRecipe($scope.newRecipe).then(function (response) {
                    this.editorShow = false;
                });
            };

            this.update = function () {
                apiService.updateRecipe($scope.currentRecipe._id, $scope.currentRecipe.content).then(function (response) {
                    this.showContent = false;
                });
            };

        }],
        controllerAs: 'feed'
    };
});

app.directive('recipePreview', function () {
    return {
        restrict: 'E',
        templateUrl: 'recipePreview.html',
        scope: {
            recipe: '=recipe'
        }
    };
});

app.directive('personPreview', function () {
    return {
        restrict: 'E',
        templateUrl: 'personPreview.html',
        scope: {
            person: '=person'
        }
    };
});
    

app.directive('recipeEditor', function () {
    return {
        restrict: 'E',
        templateUrl: 'recipeEditor.html',
        scope: {
            recipe: '=',
            submit: "&"
        }
    };
});





app.directive('person', function () {
    return {
        restrict: 'E',
        templateUrl: 'person.html',
        scope: {
            person: '='
        }

    };
});


/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('easyListing', ['ui.bootstrap']);
app.controller('mainCtrl', ['$scope', function($scope) {
    /*************************************************************
     * Global Variables
     *************************************************************/
    // types of pages that display within the application
    $scope.applicationPages = {
        WELCOME: 0,
        LISTING: 1,
        LOADING: 2,
        SUCCESS: 3,
        FAILED: 4
    };
    $scope.userLoggedIn = false;
    /*************************************************************
     * Functions
     *************************************************************/
    //start the program with the welcome page
    $scope.currentPageDisplayed = $scope.applicationPages.WELCOME;

    /* Start a new listing and switch to the listing page */
    $scope.startNewListing = function() {
        $scope.currentPageDisplayed = $scope.applicationPages.LISTING;
    }
}]);
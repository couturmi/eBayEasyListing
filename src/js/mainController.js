/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('easyListing', ['ui.bootstrap']);
app.controller('mainCtrl', ['$scope','$rootScope','$http', function($scope, $rootScope, $http) {
    /*************************************************************
     * Global Variables
     *************************************************************/
    $scope.tradingAPIDLL_Sandbox = '/ebayApiSandbox/ws/api.dll';
    $scope.tradingAPIDLL_Prod = '/ebayApiProd/ws/api.dll';
    $rootScope.tradingAPIDLL = $scope.tradingAPIDLL_Sandbox;

    // types of pages that display within the application
    $rootScope.applicationPages = {
        WELCOME: 0,
        LISTING: 1,
        LOADING: 2,
        SUCCESS: 3,
        FAILED: 4
    };
    $rootScope.userLoggedIn = false;
    $http.get('properties/applicationDetails/applicationKeys.json').success(function(data) {
        $rootScope.applicationKeys=data;
        $rootScope.API_DEV_NAME = $rootScope.applicationKeys.SANDBOX_API_DEV_NAME;
        $rootScope.API_APP_NAME = $rootScope.applicationKeys.SANDBOX_API_APP_NAME;
        $rootScope.API_CERT_NAME = $rootScope.applicationKeys.SANDBOX_API_CERT_NAME;
        $rootScope.API_COMPATIBILITY_LEVEL = $rootScope.applicationKeys.API_COMPATIBILITY_LEVEL;
    });

    /*************************************************************
     * Functions
     *************************************************************/
    //start the program with the welcome page
    $rootScope.currentPageDisplayed = $rootScope.applicationPages.WELCOME;

    /* Start a new listing and switch to the listing page */
    $scope.startNewListing = function() {
        $rootScope.currentPageDisplayed = $rootScope.applicationPages.LISTING;
    }
}]);
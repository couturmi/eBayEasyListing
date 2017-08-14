/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('easyListing', ['ui.bootstrap']);
app.controller('mainCtrl', ['$scope','$rootScope','$http', function($scope, $rootScope, $http) {
    /*************************************************************
     * Global Variables
     *************************************************************/
    /** CURRENT ENVIRONMENT **/
    $rootScope.ENV = "SANDBOX";
    /**---------------------**/

    $scope.tradingAPIDLL_Sandbox = '/ebayApiSandbox/ws/api.dll';
    $scope.tradingAPIDLL_Prod = '/ebayApiProd/ws/api.dll';
    //set urls according to current environment
    if($rootScope.ENV == "SANDBOX") {
        $rootScope.tradingAPIDLL = $scope.tradingAPIDLL_Sandbox;
    } else if($rootScope.ENV == "PROD"){
        $rootScope.tradingAPIDLL = $scope.tradingAPIDLL_Prod;
    }

    //list of submitted listings
    $rootScope.submittedListings = [];

    // types of pages that display within the application
    $rootScope.applicationPages = {
        WELCOME: 0,
        LISTING: 1,
        LOADING: 2,
        SUCCESS: 3,
        FAILED: 4
    };
    // application keys
    $http.get('properties/applicationDetails/applicationKeys.json').success(function(data) {
        $rootScope.applicationKeys=data;
        if($rootScope.ENV == "SANDBOX") {
            $rootScope.API_DEV_NAME = $rootScope.applicationKeys.SANDBOX_API_DEV_NAME;
            $rootScope.API_APP_NAME = $rootScope.applicationKeys.SANDBOX_API_APP_NAME;
            $rootScope.API_CERT_NAME = $rootScope.applicationKeys.SANDBOX_API_CERT_NAME;
        } else if($rootScope.ENV == "PROD"){
            $rootScope.API_DEV_NAME = $rootScope.applicationKeys.PROD_API_DEV_NAME;
            $rootScope.API_APP_NAME = $rootScope.applicationKeys.PROD_API_APP_NAME;
            $rootScope.API_CERT_NAME = $rootScope.applicationKeys.PROD_API_CERT_NAME;
        }
        $rootScope.API_COMPATIBILITY_LEVEL = $rootScope.applicationKeys.API_COMPATIBILITY_LEVEL;
    });
    // check if authToken exists in session. If not, user must log in
    $rootScope.userLoggedIn = false;
    $rootScope.AuthToken = "";
    if(sessionStorage.authToken){
        $rootScope.userLoggedIn = true;
        //set auth token
        $rootScope.AuthToken = sessionStorage.authToken;
        //set user profiles
        $http.get('properties/userDetails/userProfiles.json').success(function(data) {
            $rootScope.profiles=data;
        });
    }
    /*************************************************************
     * Tab Functions
     *************************************************************/
    //list of all tabs/pages
    $rootScope.listingPages = [];
    //count of pages added
    $rootScope.pageCount = 0;
    //count of pages closed
    $rootScope.closedPageCount = 0;
    //the type of page currently displayed
    $rootScope.currentPageDisplayed = $rootScope.applicationPages.WELCOME;
    //the current tab that is open
    $rootScope.currentTab = 0;
    //true when the max number of tabs has been reached
    $rootScope.maxTabs = false;
    //true if a listing is already being edited
    $rootScope.listingIsOpen = false;

    //create a new blank page
    $scope.newBlankPage = function(key){
        var blankPage = {
            key:key,
            currentPage: $rootScope.applicationPages.WELCOME,
            closed:false
        };
        return blankPage;
    }

    $scope.tabClicked = function(key) {
        //remove active class from current tab
        if(document.getElementById("tab"+$rootScope.currentTab)) {
            document.getElementById("tab" + $rootScope.currentTab).classList.remove('active');
        }
        $rootScope.currentPageDisplayed = $rootScope.listingPages[key].currentPage;
        $rootScope.currentTab = key;
        //add active class for current tab
        document.getElementById("tab"+$rootScope.currentTab).classList.add('active');
    }

    $scope.newTabClicked = function() {
        //can only add if 8 or less tabs open
        if($rootScope.pageCount - $rootScope.closedPageCount < 8) {
            //remove active class from current tab
            if (document.getElementById("tab" + $rootScope.currentTab)) {
                document.getElementById("tab" + $rootScope.currentTab).classList.remove('active');
            }
            //create page
            $rootScope.listingPages.push($scope.newBlankPage($rootScope.pageCount));
            //display first page
            $rootScope.currentPageDisplayed = $rootScope.listingPages[$rootScope.pageCount].currentPage;
            //set this new tab to the current displayed tab
            $rootScope.currentTab = $rootScope.pageCount;
            //increment for next key
            $rootScope.pageCount++;
            //set up to hold listing data
            $rootScope.submittedListings.push({});
            if($rootScope.pageCount - $rootScope.closedPageCount >= 8){
                $rootScope.maxTabs = true;
            }
        }
    }
    //create first page on startup
    $scope.newTabClicked();

    //close a tab
    $scope.closeTab = function(pageKey){
        $rootScope.listingPages[pageKey].closed = true;
        //if an open listing, set listingIsOpen to false
        if($rootScope.listingPages[pageKey].currentPage == $rootScope.applicationPages.LISTING){
            $rootScope.listingIsOpen = false;
        }
        //remove listing from dom
        var child = document.getElementById("listing"+$rootScope.currentTab);
        child.parentNode.removeChild(child);
        //set new currentTab if currentTab was closed
        if($rootScope.currentTab == pageKey) {
            for(let i = 0; i < $rootScope.listingPages.length; i++){
                if($rootScope.listingPages[i].closed == false) {
                    $scope.tabClicked($rootScope.listingPages[i].key);
                    break;
                }
            }
        }
        //increment closed page count
        $rootScope.closedPageCount++
        //maxTabs should no longer be true if a tab is closed
        $rootScope.maxTabs = false;
    }
    //filter for displayed tabs
    $scope.tabIsNotClosedFilter = function(item){
        if(item.closed){
            return false;
        }
        return true;
    }

    /*************************************************************
     * Page switch Functions
     *************************************************************/
    /* Start a new listing and switch to the listing page */
    $scope.startNewListing = function() {
        $rootScope.listingPages[$rootScope.currentTab].currentPage = $rootScope.applicationPages.LISTING;
        $rootScope.currentPageDisplayed = $rootScope.applicationPages.LISTING;
        $rootScope.listingIsOpen = true;
    }
    /* Start a new listing and switch to the listing page */
    $rootScope.switchToLoading = function() {
        $rootScope.listingPages[$rootScope.currentTab].currentPage = $rootScope.applicationPages.LOADING;
        $rootScope.currentPageDisplayed = $rootScope.applicationPages.LOADING;
        $rootScope.listingIsOpen = false;
    }
    /* Start a new listing and switch to the listing page */
    $rootScope.switchToSuccess = function(key) {
        $rootScope.listingPages[key].currentPage = $rootScope.applicationPages.SUCCESS;
        if(key == $rootScope.currentTab) {
            $rootScope.currentPageDisplayed = $rootScope.applicationPages.SUCCESS;
        }
    }
    /* Start a new listing and switch to the listing page */
    $rootScope.switchToFailed = function(key) {
        $rootScope.listingPages[key].currentPage = $rootScope.applicationPages.FAILED;
        if(key == $rootScope.currentTab) {
            $rootScope.currentPageDisplayed = $rootScope.applicationPages.FAILED;
        }
    }

    /*************************************************************
     * Navbar Button Functions
     *************************************************************/
    $scope.logOutUser = function() {
        $rootScope.userLoggedIn = false;
        $rootScope.AuthToken = "";
        sessionStorage.removeItem('authToken');
        location.reload();
    }
}]);
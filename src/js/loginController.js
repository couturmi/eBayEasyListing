/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('easyListing');
app.controller('loginCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    /******************************************
     * Global Variables
     ******************************************/
    $scope.Sandbox_AuthNAuthSignInURL = "/ebayApiSignInSandbox/ws/eBayISAPI.dll?SignIn&runame="+$rootScope.applicationKeys.SANDBOX_RUNAME+"&SessID=";
    $scope.Prod_AuthNAuthSignInURL = "/ebayApiSignInProd/ws/eBayISAPI.dll?SignIn&runame="+$rootScope.applicationKeys.PROD_RUNAME+"&SessID=";
    $scope.AuthNAuthSignInURL = $scope.Sandbox_AuthNAuthSignInURL;
    $scope.RuName = $rootScope.applicationKeys.SANDBOX_RUNAME;

    $scope.getSessionIDRequestURL = "xmlRequests/getSessionIDRequest.xml";
    $scope.getFetchTokenRequestURL = "xmlRequests/fetchTokenRequest.xml";

    $scope.sessionID = "";
    $scope.loading = false;
    $scope.loginFailed = false;

    /******************************************
     * Angular Functions
     ******************************************/

    $scope.loginUser = function() {
        $scope.loading = true;
        $scope.loginFailed = false;
        $scope.performGetSessionIDRequest();
    }

    /******************************************
     * XML functions
     ******************************************/
    var serializer = new XMLSerializer();

    var createGetSessionIDXML = function(response) {
        /* Get XML DOM object */
        var getSessionIDRequest = response.responseXML;

        /* Populate XML Request with RuName */
        if($scope.RuName)
            getSessionIDRequest.getElementsByTagName("RuName")[0].childNodes[0].nodeValue = $scope.RuName;

        /* Submit Listing */
        $scope.getSession(serializer.serializeToString(getSessionIDRequest));
    }

    var createFetchTokenXML = function(response) {
        /* Get XML DOM object */
        var fetchTokenRequest = response.responseXML;

        /* Populate XML Request with session ID */
        if($scope.sessionID)
            fetchTokenRequest.getElementsByTagName("SessionID")[0].childNodes[0].nodeValue = $scope.sessionID;

        /* Submit Listing */
        $scope.fetchToken(serializer.serializeToString(fetchTokenRequest));
    }

    $scope.performGetSessionIDRequest = function() {
        //begin sending request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                createGetSessionIDXML(this);
            }
        };
        xhttp.open("GET", $scope.getSessionIDRequestURL, true);
        xhttp.send();
    }

    $scope.performFetchTokenRequest = function() {
        //wait for a couple seconds. then perform request
        $scope.timeoutInterval = setInterval(function() {
            //begin sending request
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    createFetchTokenXML(this);
                }
            };
            xhttp.open("GET", $scope.getFetchTokenRequestURL, true);
            xhttp.send();
            //remove interval
            clearInterval($scope.timeoutInterval);
        }, 2000);
    }

    /******************************************
     * HTTP functions
     ******************************************/
    var GetSessionIDConfig = {
        headers: {
            'Content-Type':'text/xml',
            'X-EBAY-API-COMPATIBILITY-LEVEL': $rootScope.API_COMPATIBILITY_LEVEL,
            'X-EBAY-API-DEV-NAME': $rootScope.API_DEV_NAME,
            'X-EBAY-API-APP-NAME': $rootScope.API_APP_NAME,
            'X-EBAY-API-CERT-NAME': $rootScope.API_CERT_NAME,
            'X-EBAY-API-CALL-NAME': 'GetSessionID',
            'X-EBAY-API-SITEID': 0
        }
    };

    var FetchTokenConfig = {
        headers: {
            'Content-Type':'text/xml',
            'X-EBAY-API-COMPATIBILITY-LEVEL': $rootScope.API_COMPATIBILITY_LEVEL,
            'X-EBAY-API-DEV-NAME': $rootScope.API_DEV_NAME,
            'X-EBAY-API-APP-NAME': $rootScope.API_APP_NAME,
            'X-EBAY-API-CERT-NAME': $rootScope.API_CERT_NAME,
            'X-EBAY-API-CALL-NAME': 'FetchToken',
            'X-EBAY-API-SITEID': 0
        }
    };

    var XMLParser = new DOMParser();

    $scope.getSession = function(xmlRequest){
        $http.post($rootScope.tradingAPIDLL, xmlRequest, GetSessionIDConfig).then( function(response){
            var ebayResponse = XMLParser.parseFromString(response.data,"text/xml");
            console.log("========RESPONSE RESULT========");
            console.log("GetSessionID Request: \n"+ebayResponse.getElementsByTagName("Ack")[0].childNodes[0].nodeValue);
            console.log("===============================");
            //set SessionID
            $scope.sessionID = ebayResponse.getElementsByTagName("SessionID")[0].childNodes[0].nodeValue;
            //log in
            $scope.goToLogInPage();
        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    };

    $scope.fetchToken = function(xmlRequest){
        $http.post($rootScope.tradingAPIDLL, xmlRequest, FetchTokenConfig).then( function(response){
            var ebayResponse = XMLParser.parseFromString(response.data,"text/xml");
            var responseCondition = ebayResponse.getElementsByTagName("Ack")[0].childNodes[0].nodeValue;
            console.log("========RESPONSE RESULT========");
            console.log("FetchToken Request: \n"+responseCondition);
            console.log("===============================");
            $scope.loading = false;
            if(responseCondition!="Failure") {
                //set Token
                $rootScope.AuthToken = ebayResponse.getElementsByTagName("eBayAuthToken")[0].childNodes[0].nodeValue;
                //display listing page
                $scope.loginSuccess();
            } else {
                $scope.loginFailed = true;
            }
        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    };

    $scope.goToLogInPage = function(){
        //open sign in page in new window
        $scope.signInPage = window.open($scope.AuthNAuthSignInURL+$scope.sessionID,'_blank');
        //watch for when the log in page is closed
        $scope.$watch('signInPage.closed', function(){
            //attempt to fetch token if sing in page is closed
            if($scope.signInPage.closed == true) {
                $scope.performFetchTokenRequest();
            }
        });
        //add an interval that digests the scope every second until the sign in page is closed
        $scope.checkInterval = setInterval(function() {
            $scope.$digest();
            if($scope.signInPage.closed == true){
                clearInterval($scope.checkInterval);
            }
        }, 1000);
    };

    $scope.loginSuccess = function(){
        //switch application state to logged in
        $rootScope.userLoggedIn = true;
        //store token in session
        if(typeof(Storage) !== "undefined"){
            sessionStorage.authToken = $scope.AuthToken;
        }
    }

}]);
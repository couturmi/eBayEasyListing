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
    if($rootScope.ENV == "SANDBOX") {
        $scope.AuthNAuthSignInURL = $scope.Sandbox_AuthNAuthSignInURL;
        $scope.RuName = $rootScope.applicationKeys.SANDBOX_RUNAME;
    } else if($rootScope.ENV == "PROD"){
        $scope.AuthNAuthSignInURL = $scope.Prod_AuthNAuthSignInURL;
        $scope.RuName = $rootScope.applicationKeys.PROD_RUNAME;
    }

    $scope.getSessionIDRequestURL = "xmlRequests/getSessionIDRequest.xml";
    $scope.getFetchTokenRequestURL = "xmlRequests/fetchTokenRequest.xml";
    $scope.getUserPreferencesRequestURL = "xmlRequests/getUserPreferencesRequest.xml";

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

    var createGetUserPreferencesXML = function(response) {
        /* Get XML DOM object */
        var getUserPreferencesRequest = response.responseXML;

        /* Populate XML Request with RuName */
        if($rootScope.AuthToken)
            getUserPreferencesRequest.getElementsByTagName("eBayAuthToken")[0].childNodes[0].nodeValue = $rootScope.AuthToken;

        /* Submit Listing */
        $scope.getUserPreferences(serializer.serializeToString(getUserPreferencesRequest));
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

    $scope.performGetUserPreferencesRequest = function() {
        //begin sending request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                createGetUserPreferencesXML(this);
            }
        };
        xhttp.open("GET", $scope.getUserPreferencesRequestURL, true);
        xhttp.send();
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

    var GetSellerProfilesConfig = {
        headers: {
            'Content-Type':'text/xml',
            'X-EBAY-API-COMPATIBILITY-LEVEL': 967,
            'X-EBAY-API-DEV-NAME': $rootScope.API_DEV_NAME,
            'X-EBAY-API-APP-NAME': $rootScope.API_APP_NAME,
            'X-EBAY-API-CERT-NAME': $rootScope.API_CERT_NAME,
            'X-EBAY-API-CALL-NAME': 'GetUserPreferences',
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
            if(responseCondition!="Failure") {
                //set Token
                $rootScope.AuthToken = ebayResponse.getElementsByTagName("eBayAuthToken")[0].childNodes[0].nodeValue;
                //get user preferences using token
                $scope.performGetUserPreferencesRequest();
            } else {
                $scope.loading = false;
                $scope.loginFailed = true;
            }
        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    };

    $scope.getUserPreferences = function(xmlRequest) {
        $http.post($rootScope.tradingAPIDLL, xmlRequest, GetSellerProfilesConfig).then( function(response){
            var ebayResponse = XMLParser.parseFromString(response.data,"text/xml");
            var responseCondition = ebayResponse.getElementsByTagName("Ack")[0].childNodes[0].nodeValue;
            console.log("========RESPONSE RESULT========");
            console.log("GetUserPreferences Request: \n"+responseCondition);
            console.log("===============================");
            $scope.loading = false;
            if(responseCondition!="Failure") {
                //get shipping and return profiles
                $scope.retrieveProfiles(ebayResponse);
                //set paypal email
                if(ebayResponse.getElementsByTagName("DefaultPayPalEmailAddress")[0])
                    $rootScope.payPalEmailAddress = ebayResponse.getElementsByTagName("DefaultPayPalEmailAddress")[0].childNodes[0].nodeValue;
                else
                    $rootScope.payPalEmailAddress = "blankEmail@gmail.com"
                //display listing page
                $scope.loginSuccess();
            } else {
                $scope.loginFailed = true;
            }
        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    }

    $scope.goToLogInPage = function(){
        //open sign in page in new window
        $scope.signInPage = window.open($scope.AuthNAuthSignInURL+$scope.sessionID,'_blank');
        //watch for when the log in page is closed
        $scope.signInWatch = $scope.$watch('signInPage.closed', function(){
            //attempt to fetch token if sing in page is closed
            if($scope.signInPage.closed == true) {
                //fetch token
                $scope.performFetchTokenRequest();
                //clear this watch
                $scope.signInWatch();
                //clear the interval just in case
                if($scope.checkInterval){
                    clearInterval($scope.checkInterval);
                }
            }
        });
        //add an interval that digests the scope every second until the sign in page is closed
        $scope.checkInterval = setInterval(function() {
            $scope.$digest();
            if($scope.signInPage.closed == true){
                if($scope.checkInterval){
                    clearInterval($scope.checkInterval);
                }
            }
        }, 1000);
    };

    $scope.retrieveProfiles = function(ebayResponse) {
        var profiles = {
            paymentProfiles: [],
            shippingProfiles: [],
            returnProfiles: []
        };
        //loop through each profile and set values accordingly
        let i = 0;
        while(ebayResponse.getElementsByTagName("SupportedSellerProfile")[i]){
            // if the profile is a payment profile
            if(ebayResponse.getElementsByTagName("ProfileType")[i].childNodes[0].nodeValue == "PAYMENT"){
                var paymentProfile = {
                    profileID: ebayResponse.getElementsByTagName("ProfileID")[i].childNodes[0].nodeValue,
                    name: ebayResponse.getElementsByTagName("ProfileName")[i].childNodes[0].nodeValue
                }
                profiles.paymentProfiles.push(paymentProfile);
            }
            // if the profile is a shipping profile
            else if(ebayResponse.getElementsByTagName("ProfileType")[i].childNodes[0].nodeValue == "SHIPPING"){
                var shippingProfile = {
                    profileID: ebayResponse.getElementsByTagName("ProfileID")[i].childNodes[0].nodeValue,
                    name: ebayResponse.getElementsByTagName("ProfileName")[i].childNodes[0].nodeValue
                }
                profiles.shippingProfiles.push(shippingProfile);
            }
            //if the profile is a return profile
            else if(ebayResponse.getElementsByTagName("ProfileType")[i].childNodes[0].nodeValue == "RETURN_POLICY"){
                var returnProfile = {
                    profileID: ebayResponse.getElementsByTagName("ProfileID")[i].childNodes[0].nodeValue,
                    name: ebayResponse.getElementsByTagName("ProfileName")[i].childNodes[0].nodeValue
                }
                profiles.returnProfiles.push(returnProfile);
            }
            i++;
        }
        $rootScope.profiles = profiles;

        //store profiles in file
        let userProfilesString = JSON.stringify($rootScope.profiles);
        $http({
            method: 'POST',
            url: "http://localhost:8080/updateUserProfiles",
            headers: {'Content-Type': undefined},
            data: {
                userProfiles: userProfilesString
            },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });
                return formData;
            }
            })
            .success(function (data) {
                console.log("successfully changed user profiles data!");
            })
            .error(function (data, status) {
                console.log("ERROR: failure updating user profiles data");
            });

    }

    $scope.loginSuccess = function(){
        //switch application state to logged in
        $rootScope.userLoggedIn = true;
        //store token in session
        if(typeof(Storage) !== "undefined"){
            sessionStorage.authToken = $scope.AuthToken;
        }
    }

}]);
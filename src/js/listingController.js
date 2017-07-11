/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('myApp');
app.controller('listingCtrl', ['$scope', '$http', function($scope, $http) {

    /* Initialize form control variables */
    $scope.updateShippingInfo = false;
    $scope.updateShippingText = "Change";
    $scope.formSectionIndex = 1;

    /* Initialize current listing */
    $scope.currentListing = {
        price:0.00,
        paymentMethods:{},
        listingType:"Fixed price",
        duration:"Good Til' Cancelled",
        shippingLocationCountry:"United States",
        shippingLocationZIP:"48162",
        shippingLocationCityState:"Test City, Michigan"
    };

    /* Listing options variables */
    $scope.listingTypeList = ["Fixed price","Auction-style"];
    $scope.listingDurationList = ["3 days","5 days","7 days","10 days","30 days","Good Til' Cancelled"];
    $scope.domesticShippingList = ["Flat: same cost to all buyers","Calculated: Cost varies by buyer location","Freight: large items over 150 lbs","No shipping: Local pickup only"];

    /* Format functions */
    $scope.formatPrice = function(){
        if(parseFloat($scope.currentListing.price) < 0){
            $scope.currentListing.price = 0;
        }
        $scope.currentListing.price = parseFloat($scope.currentListing.price.toFixed(2));
        document.getElementById("priceInput").value = $scope.currentListing.price.toFixed(2);
    };

    /* angularJS functions*/
    $scope.nextSection = function(){
        $scope.formSectionIndex++;
        setTimeout(function(){
            window.scrollTo(0,document.body.scrollHeight);
        }, 100);
    };

    $scope.allPaymentMenthodsChecked = function() {
        if(!$scope.currentListing.paymentMethods.pm_payPal ||
            !$scope.currentListing.paymentMethods.pm_visaMaster ||
            !$scope.currentListing.paymentMethods.pm_discover ||
            !$scope.currentListing.paymentMethods.pm_amerExpr ||
            !$scope.currentListing.paymentMethods.pm_pickup){
            return false;
        }
        return true;
    };

    $scope.changeShippingDetails = function() {
        if(!$scope.updateShippingInfo){
            $scope.updateShippingInfo = true;
            $scope.updateShippingText = "Update";
        } else {
            $scope.updateShippingInfo = false;
            $scope.updateShippingText = "Change";
        }
    };

    /******************************************
     * HTTP functions
     ******************************************/
    var config = {
            headers: {
                'Content-Type':'text/xml',
                'X-EBAY-API-COMPATIBILITY-LEVEL': 915,
                'X-EBAY-API-DEV-NAME': '6387f409-1f6a-416c-88f4-4ed3f0791984',
                'X-EBAY-API-APP-NAME': 'Mitchell-eBayEasy-SBX-f09141381-69d9c08c',
                'X-EBAY-API-CERT-NAME': 'SBX-09141381a927-4830-414d-acb5-1173',
                'X-EBAY-API-CALL-NAME': 'GeteBayOfficialTime',
                'X-EBAY-API-SITEID': 0
            }
        };
    var xml =
        "<?xml version='1.0' encoding='utf-8'?>" +
        "<GeteBayOfficialTimeRequest xmlns=\"urn:ebay:apis:eBLBaseComponents\">" +
        "  <RequesterCredentials>" +
        "    <eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**b/FjWQ**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GkCpCBqQydj6x9nY+seQ**UDcEAA**AAMAAA**haPTP9tAd2O3TQv0sloQ4Rxe5S4b8mJnFSPjDTVNFC2TqGJGroTFbiyub0j2+YD+M2q+8+pvFn20bXDH7fZpcHTx7tu6WAc1FVn8YRh50su2VmVdooVhGfyDwVyDcNWwxxuAeC2b5UwhC5Q8FCtj/9lqYJb+ecj/JWnDinOrHoZSz28MRETZs/ZGGP8P1kK1tbKDgIw50HUey2TdguKcN4SOw0Fh2sx6HY5JsrVs/boBksOCuKuY97kigKVawnWsAZzAxYfe1gM7QHhLQJP8aypawwlXr5bOcGsF8M0dN7WikvbdKfeOmYMh3ar7L4J9MLt6ldAOU3PlVO5JAE1oIdo/eOKzVE/Uutq8BbmQ3n71nzsNV1dWhFsxYUiM1YAg7eG1PrZkpPDWhdku71Kv+z8o8I7m0kRTl8QChCHk24KV9K3DPO6k+uu563jR2jvwg+TxAliiCPmM+KzWKgbwwQb32ArToTD/Eti6DfGCI6LtuO92mCxC3+CEDH3ZEI06GI1zW5ZvrQuV0yjIjZ8PWLEcf0wDSmuIKteZx0frnswE8I4Kvu6L/Yv6t53j1vtBa9fGK9NQ8JDORxnC8e+sh3HnUnc/HXgYYzeYldIne3uhJbco+Kv6HexTwCEM5vTm7J6zD/zstyCC5puImiNsfl+9+J1M/Xz2eFeG+mQjxCsquKrv+rDI0F2nG78EnkohjBcJJwn3vjRXsJ0LPYQ4jYqhUMel8qd9plcDgEdk6RMYeKC5MzMmJvjrGKy1gpGW</eBayAuthToken>" +
        "  </RequesterCredentials>" +
        "</GeteBayOfficialTimeRequest>";
    var XMLParser = new DOMParser();

    $scope.submitListing = function(){
        $http.post('/ebayApiSandbox/ws/api.dll', xml, config).then( function(response){
            console.log(response.data);
            var xmlResponse = XMLParser.parseFromString(response.data,"text/xml");
            console.log(xmlResponse.getElementsByTagName("Timestamp")[0].childNodes[0].nodeValue);
        }, function(){
            console.log("error.");
        });
    };

}]);
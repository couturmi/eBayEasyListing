/**
 * Created by mitchcout on 7/18/2017.
 */
var app = angular.module('easyListing');
app.controller('findProductCtrl', ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {

    /**
     * Opens modal to select a product when only 1 matching product is found
     */
    $scope.openSingleProductSelection = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'html/modals/selectProductModal.html',
            controller: 'selectProductModalCtrl',
            resolve: {
                productsListXML : function() {
                    return $scope.relatedProductsXMLList;
                }
            }
        });

        modalInstance.result.then(function (product) {
            $scope.$parent.currentListing.productId = product.productId;
            $scope.$parent.currentListing.title.full = product.productTitle;
        }, function () {
        });
    };

    /**
     * Opens modal to select from a list of products when many matching products are found
     */
    $scope.openMultipleProductSelection = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'html/modals/selectProductMultipleModal.html',
            controller: 'selectProductMultipleModalCtrl',
            resolve: {
                productsListXML : function() {
                    return $scope.relatedProductsXMLList;
                }
            }
        });

        modalInstance.result.then(function (product) {
            $scope.$parent.currentListing.productId = product.productId;
            $scope.$parent.currentListing.title.full = product.productTitle;
        }, function () {
        });
    };

    /**
     * Opens modal to inform user if no matches were found
     */
    $scope.openNoProductSelection = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'html/modals/noProductModal.html',
            controller: 'noProductModalCtrl'
        });
    };

    /******************************************
     * XML functions
     ******************************************/
    var serializer = new XMLSerializer();

    var createfindProductsXML = function(response) {
        /* Get XML DOM object */
        var findProductsRequest = response.responseXML;

        /* Populate XML Request with input from listing form */
        if($scope.$parent.currentListing.title.full)
            findProductsRequest.getElementsByTagName("QueryKeywords")[0].childNodes[0].nodeValue = $scope.$parent.currentListing.title.full;

        /* Submit Listing */
        $scope.findProducts(serializer.serializeToString(findProductsRequest));
    }

    $scope.performFindProductsRequest = function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                createfindProductsXML(this);
            }
        };
        xhttp.open("GET", $scope.$parent.findProductsRequestURL, true);
        xhttp.send();
    }

    /******************************************
     * HTTP functions
     ******************************************/
    var findProductsConfig = {
        headers: {
            'Content-Type':'text/xml',
            'X-EBAY-API-APP-ID':'Mitchell-eBayEasy-SBX-f09141381-69d9c08c',
            'X-EBAY-API-SITE-ID':0,
            'X-EBAY-API-CALL-NAME':'FindProducts',
            'X-EBAY-API-VERSION':863,
            'X-EBAY-API-REQUEST-ENCODING':'XML'
        }
    };

    var XMLParser = new DOMParser();

    $scope.findProducts = function(xmlRequest){
        $http.post($scope.$parent.shoppingAPI_Sandbox, xmlRequest, findProductsConfig).then( function(response){
            $scope.relatedProductsXMLList = XMLParser.parseFromString(response.data,"text/xml");
            console.log("========RESPONSE RESULT========");
            console.log("FindProducts Request: \n"+$scope.relatedProductsXMLList.getElementsByTagName("Ack")[0].childNodes[0].nodeValue);
            console.log("===============================");
            /** check if product match is found **/
            // no match found
            if($scope.relatedProductsXMLList.getElementsByTagName("Product").length == 0){
                $scope.openNoProductSelection();
            }
            // one match found
            else if($scope.relatedProductsXMLList.getElementsByTagName("Product").length == 1){
                $scope.openSingleProductSelection();
            }
            // many matches found
            else {
                $scope.openMultipleProductSelection();
            }

        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    };
}]);
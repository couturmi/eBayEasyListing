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
            $scope.setProductId(product);
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
            $scope.setProductId(product);
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

    /**
     * Sets the productID on the parent scope
     */
    $scope.setProductId = function(product) {
        $scope.$parent.currentListing.catalogInfo.productId = product.productId;
        $scope.$parent.currentListing.catalogInfo.productName = product.productTitle;
        $scope.$parent.chooseDetails = false;
        $scope.$parent.findProductButtonTitle = "Choose New Details";
        $scope.$parent.refreshListingTitle();
    }

    $scope.chooseNewDetails = function() {
        $scope.$parent.chooseDetails = true;
        $scope.$parent.findProductButtonTitle = "Find Product";
    }

    /******************************************
     * Alert functions
     ******************************************/
    $scope.$parent.alertType = "";
    $scope.$parent.alertOpen = false;

    $scope.openFindProductAlert = function(){
        //display success alert
        $scope.$parent.alertType = $scope.$parent.alertTypes.SUCCESS;
    }
    $scope.openErrorAlert = function(){
        //display error alert
        $scope.$parent.alertType = $scope.$parent.alertTypes.ERROR;
    }

    $scope.$parent.findProductAlertClicked = function() {
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
        $scope.$parent.alertOpen = false;
    }

    // keeps alert dialogs at the top of the screen
    $(window).scroll(function(){
        if($scope.$parent.alertType != "" && $('#'+$scope.$parent.alertType) != null) {
            var windowScrollTop = $(window).scrollTop();
            $('#'+$scope.$parent.alertType).css('top', windowScrollTop);
        }
    });

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
        //display loading alert
        $scope.$parent.alertType = $scope.$parent.alertTypes.LOADING;
        $scope.$parent.alertOpen = true;

        //begin sending request
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
            'X-EBAY-API-APP-ID': $scope.$parent.API_APP_NAME,
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
            let responseCondition = $scope.relatedProductsXMLList.getElementsByTagName("Ack")[0].childNodes[0].nodeValue;
            console.log("========RESPONSE RESULT========");
            console.log("FindProducts Request: \n"+responseCondition);
            console.log("===============================");
            // check for errors
            if(responseCondition == "Failure"){
                //display error alert
                $scope.openErrorAlert();
            }
            // if no errors, display success alert
            else {
                $scope.openFindProductAlert();
            }
        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    };
}]);
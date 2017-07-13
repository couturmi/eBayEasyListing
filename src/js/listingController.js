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
        paymentMethods:{
            pm_payPal: true
        },
        listingType:"FixedPriceItem",
        listingDuration:"Good Til' Cancelled",
        shippingLocationCountry:"United States",
        shippingLocationZIP:"48162",
        shippingLocationCityState:"Test City, Michigan"
    };

    /* Listing options variables */
    $scope.listingTypeList = ["FixedPriceItem"];
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
    }

    /******************************************
     * XML functions
     ******************************************/
    var serializer = new XMLSerializer();

    var createAddItemXML = function(response) {
        /* Get XML DOM object */
        var addItemRequest = response.responseXML;

        /* Populate XML Request with input from listing form */
        if($scope.currentListing.title)
            addItemRequest.getElementsByTagName("Title")[0].childNodes[0].nodeValue = $scope.currentListing.title;
        if($scope.currentListing.category)
            //TODO: Primary Category
        if($scope.currentListing.condition)
            addItemRequest.getElementsByTagName("ConditionID")[0].childNodes[0].nodeValue = $scope.currentListing.condition;
        if($scope.currentListing.desc)
            addItemRequest.getElementsByTagName("Description")[0].childNodes[0].nodeValue = $scope.currentListing.desc;
        if($scope.currentListing.title)
            //TODO: Photos
        if($scope.currentListing.listingType)
            addItemRequest.getElementsByTagName("ListingType")[0].childNodes[0].nodeValue = $scope.currentListing.listingType;
        if($scope.currentListing.listingDuration){
            if($scope.currentListing.listingDuration == "Good Til' Cancelled")
                addItemRequest.getElementsByTagName("ListingDuration")[0].childNodes[0].nodeValue = "GTC";
            else if($scope.currentListing.listingDuration == "3 days")
                addItemRequest.getElementsByTagName("ListingDuration")[0].childNodes[0].nodeValue = "Days_3";
            else if($scope.currentListing.listingDuration == "5 days")
                addItemRequest.getElementsByTagName("ListingDuration")[0].childNodes[0].nodeValue = "Days_5";
            else if($scope.currentListing.listingDuration == "7 days")
                addItemRequest.getElementsByTagName("ListingDuration")[0].childNodes[0].nodeValue = "Days_7";
            else if($scope.currentListing.listingDuration == "10 days")
                addItemRequest.getElementsByTagName("ListingDuration")[0].childNodes[0].nodeValue = "Days_10";
            else if($scope.currentListing.listingDuration == "30 days")
                addItemRequest.getElementsByTagName("ListingDuration")[0].childNodes[0].nodeValue = "Days_30";
        }
        if($scope.currentListing.price)
            addItemRequest.getElementsByTagName("StartPrice")[0].childNodes[0].nodeValue = $scope.currentListing.price;
        if($scope.currentListing.paymentMethods.all || $scope.currentListing.paymentMethods.pm_payPal || $scope.currentListing.paymentMethods.pm_visaMaster || $scope.currentListing.paymentMethods.pm_discover
            || $scope.currentListing.paymentMethods.pm_amerExpr || $scope.currentListing.paymentMethods.pm_pickup) {
            let ItemElement = addItemRequest.getElementsByTagName("Item")[0];
            if($scope.currentListing.paymentMethods.all || $scope.currentListing.paymentMethods.pm_visaMaster){
                let tempElement = addItemRequest.createElement("PaymentMethods");
                let tempTextNode = addItemRequest.createTextNode("VisaMC");
                tempElement.appendChild(tempTextNode);
                ItemElement.appendChild(tempElement);
            }
            if($scope.currentListing.paymentMethods.all || $scope.currentListing.paymentMethods.pm_discover){
                let tempElement = addItemRequest.createElement("PaymentMethods");
                let tempTextNode = addItemRequest.createTextNode("Discover");
                tempElement.appendChild(tempTextNode);
                ItemElement.appendChild(tempElement);
            }
            if($scope.currentListing.paymentMethods.all || $scope.currentListing.paymentMethods.pm_amerExpr){
                let tempElement = addItemRequest.createElement("PaymentMethods");
                let tempTextNode = addItemRequest.createTextNode("AmEx");
                tempElement.appendChild(tempTextNode);
                ItemElement.appendChild(tempElement);
            }
            if($scope.currentListing.paymentMethods.all || $scope.currentListing.paymentMethods.pm_pickup){
                let tempElement = addItemRequest.createElement("PaymentMethods");
                let tempTextNode = addItemRequest.createTextNode("PayOnPickup");
                tempElement.appendChild(tempTextNode);
                ItemElement.appendChild(tempElement);
            }
            if($scope.currentListing.paymentMethods.all || $scope.currentListing.paymentMethods.pm_payPal){
                let tempElement = addItemRequest.createElement("PaymentMethods");
                let tempTextNode = addItemRequest.createTextNode("PayPal");
                tempElement.appendChild(tempTextNode);
                ItemElement.appendChild(tempElement);
                let tempElement2 = addItemRequest.createElement("PayPalEmailAddress");
                let tempTextNode2 = addItemRequest.createTextNode("mitchcout@gmail.com");
                tempElement2.appendChild(tempTextNode2);
                ItemElement.appendChild(tempElement2);
            }
        }
        if($scope.currentListing.title)
            //TODO: Return Options
        if($scope.currentListing.title)
            //TODO: Shipping Options

        /* Submit Listing */
        $scope.submitListing(serializer.serializeToString(addItemRequest));
    }

    $scope.performAddItemRequest = function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                createAddItemXML(this);
            }
        };
        xhttp.open("GET", "xmlRequests/AddItemRequest.xml", true);
        xhttp.send();
    }
    $scope.performAddItemRequest();

    /******************************************
     * HTTP functions
     ******************************************/
    var AddItemConfig = {
            headers: {
                'Content-Type':'text/xml',
                'X-EBAY-API-COMPATIBILITY-LEVEL': 915,
                'X-EBAY-API-DEV-NAME': '6387f409-1f6a-416c-88f4-4ed3f0791984',
                'X-EBAY-API-APP-NAME': 'Mitchell-eBayEasy-SBX-f09141381-69d9c08c',
                'X-EBAY-API-CERT-NAME': 'SBX-09141381a927-4830-414d-acb5-1173',
                'X-EBAY-API-CALL-NAME': 'VerifyAddItem',
                'X-EBAY-API-SITEID': 0
            }
    };

    var XMLParser = new DOMParser();

    $scope.submitListing = function(xmlRequest){
        console.log(xmlRequest);
        $http.post('/ebayApiSandbox/ws/api.dll', xmlRequest, AddItemConfig).then( function(response){
            console.log(response.data);
            var ebayResponse = XMLParser.parseFromString(response.data,"text/xml");
            console.log("========RESPONSE RESULT========");
            console.log(ebayResponse.getElementsByTagName("Ack")[0].childNodes[0].nodeValue);
            console.log("===============================");
        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    };

}]);
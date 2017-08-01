/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('easyListing');
app.controller('listingCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    /************************************************************************
     * Global Variables
     ************************************************************************/
    $scope.tradingAPIDLL_Sandbox = '/ebayApiSandbox/ws/api.dll';
    $scope.shoppingAPI_Sandbox = '/ebayShoppingApiSandbox/shopping?callname=FindProducts&responseencoding=XML&appid=Mitchell-eBayEasy-SBX-f09141381-69d9c08c&siteid=0&QueryKeywords=Apple&version=863';
    $scope.tradingAPIDLL_Prod = '/ebayApiProd/ws/api.dll';

    $scope.addItemRequestURL = "xmlRequests/AddItemRequest.xml";
    $scope.findProductsRequestURL = "xmlRequests/findProductsRequest.xml";

    $scope.userDetails_shippingDetailsURL = "properties/userDetails/shippingDetails.json";

    $scope.iPhoneID = 9355;
    $scope.iPodID = 73839;

    $scope.alertTypes = {
        SUCCESS: "alertSuccess",
        LOADING: "alertLoading",
        ERROR: "alertError"
    }

    /******************************************
     * String functions
     ******************************************/
    //replace all instances of text in a string
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    /******************************************
     * Form functions
     ******************************************/
    /* Initialize form control variables */
    $scope.chooseDetails = true;
    $scope.findProductButtonTitle = "Find Product";
    $scope.updateShippingInfo = false;
    $scope.updateShippingText = "Change";
    $scope.formSectionIndex = 1;

    /* Get user JSON data */
    $http.get($scope.userDetails_shippingDetailsURL).success(function(data) {
        $scope.currentListing.shippingLocationCountry=data.shippingLocationCountry;
        $scope.currentListing.shippingLocationZIP=data.shippingLocationZIP;
        $scope.currentListing.shippingLocationCityState=data.shippingLocationCityState;
        //if user data has not yet been saved, request info from user
        if($scope.currentListing.shippingLocationCountry == null || $scope.currentListing.shippingLocationCountry == "" ||
            $scope.currentListing.shippingLocationZIP == null || $scope.currentListing.shippingLocationZIP == "" ||
            $scope.currentListing.shippingLocationCityState == null || $scope.currentListing.shippingLocationCityState == ""){
            $scope.updateShippingInfo = true;
        }
    });

    /* Initialize current listing */
    $scope.currentListing = {
        title: {},
        category: {},
        catalogInfo: {},
        price:0.00,
        paymentMethods:{
            pm_payPal: true
        },
        listingType:"FixedPriceItem",
        listingDuration:"30 days",
        returnOption:"ReturnsAccepted",
        shippingLocationCountry:"",
        shippingLocationZIP:"",
        shippingLocationCityState:""
    };

    /* Get listing JSON data */
    $http.get('properties/listingDetails/iPodModels.json').success(function(data) {
        $scope.ipod_models=data.ipod_models;
    });
    $http.get('properties/listingDetails/iPhoneModels.json').success(function(data) {
        $scope.iphone_models=data.iphone_models;
    });
    $http.get('properties/listingDetails/iPodGenerations.json').success(function(data) {
        $scope.ipod_generations=data.ipod_generations;
    });
    $http.get('properties/listingDetails/storageSizes.json').success(function(data) {
        $scope.storage_sizes=data.storage_sizes;
    });
    $http.get('properties/listingDetails/productColors.json').success(function(data) {
        $scope.product_colors=data.product_colors;
    });
    $http.get('properties/listingDetails/productDefects.json').success(function(data) {
        $scope.product_defects=data.product_defects;
        $scope.blankSelectedDefectList();   //create empty list on startup
    });
    $http.get('properties/listingDetails/listingTypeList.json').success(function(data) {
        $scope.listingTypeList=data.listingTypeList;
    });
    $scope.listingDurationList = ["3 days","5 days","7 days","10 days","30 days","Good Til' Cancelled"];
    $http.get('properties/listingDetails/listingConditions.json').success(function(data) {
        $scope.listingConditions=data.listingConditions;
    });
    $http.get('properties/listingDetails/iPhoneCarriers.json').success(function(data) {
        $scope.iphone_carriers=data.iphone_carriers;
    });
    $scope.domesticShippingList = ["Flat: same cost to all buyers","Calculated: Cost varies by buyer location","Freight: large items over 150 lbs","No shipping: Local pickup only"];
    $scope.listingFilters = {};

    /* Format/Filter functions */
    $scope.formatPrice = function(){
        if(parseFloat($scope.currentListing.price) < 0){
            $scope.currentListing.price = 0;
        }
        $scope.currentListing.price = parseFloat($scope.currentListing.price.toFixed(2));
        document.getElementById("priceInput").value = $scope.currentListing.price.toFixed(2);
    };

    $scope.filterGeneration = function(gen){
        if($scope.listingFilters.generationList) {
            for (let i = 0; i < $scope.listingFilters.generationList.length; i++) {
                if ($scope.listingFilters.generationList[i] == gen.key)
                    return true;
            }
        }
        return false;
    }

    $scope.filterModelCapacity = function(size){
        if($scope.listingFilters.capacityList) {
            for (let i = 0; i < $scope.listingFilters.capacityList.length; i++) {
                if ($scope.listingFilters.capacityList[i] == size.key)
                    return true;
            }
        }
        return false;
    }

    $scope.filterProductColor = function(color){
        if($scope.listingFilters.colorList) {
            for (let i = 0; i < $scope.listingFilters.colorList.length; i++) {
                if ($scope.listingFilters.colorList[i] == color.key)
                    return true;
            }
        }
        return false;
    }

    /* angularJS functions*/

    //scroll the page down to the next section
    $scope.nextSection = function(){
        $scope.formSectionIndex++;
        setTimeout(function(){
            window.scrollTo(0,document.body.scrollHeight);
        }, 100);
    };

    var createListingTitle = function(){
        let fullTitle = "";
        if($scope.chooseDetails) {
            if ($scope.currentListing.title.type)
                fullTitle += $scope.currentListing.title.type;
            if ($scope.currentListing.title.model)
                fullTitle += " " + $scope.currentListing.title.model;
            if ($scope.currentListing.title.generation)
                fullTitle += " " + $scope.currentListing.title.generation;
            if ($scope.currentListing.title.capacity && $scope.currentListing.category.primary == $scope.iPhoneID)
                fullTitle += " - " + $scope.currentListing.title.capacity + " -";
            if ($scope.currentListing.title.color)
                fullTitle += " " + $scope.currentListing.title.color;
            if ($scope.currentListing.title.capacity && $scope.currentListing.category.primary == $scope.iPodID)
                fullTitle += " (" + $scope.currentListing.title.capacity + ")";
            if ($scope.currentListing.title.carrier)
                fullTitle += " (" + $scope.currentListing.title.carrier + ")";
            if ($scope.currentListing.title.bundle)
                fullTitle += " Bundle";
        } else {
            if ($scope.currentListing.catalogInfo.productName)
                fullTitle += $scope.currentListing.catalogInfo.productName;
            if ($scope.currentListing.title.bundle) {
                if(fullTitle[fullTitle.length - 1] != " ") {
                    fullTitle += " ";
                }
                fullTitle += "Bundle";
            }
        }
        return fullTitle;
    }

    $scope.refreshListingTitle = function() {
        $scope.currentListing.title.full = createListingTitle();
    }

    $scope.selectProductType = function(option){
        //clear model
        $scope.currentListing.title.model = "";
        $scope.currentListing.category = {};
        //clear anything below if new option is chosen
        if($scope.currentListing.category.primary != option){
            $scope.selectModel(null, true);
        }
        //select option
        if(option == $scope.iPodID){
            $scope.currentListing.category.primary = $scope.iPodID; //Consumer Electronics > Portable Audio & Headphones > iPods & MP3 Players
            document.getElementById('productType1').classList.add('btn-filled');
            document.getElementById('productType2').classList.remove('btn-filled');
            $scope.currentListing.title.type = "Apple iPod";
            $scope.currentListing.title.full = createListingTitle();
            $scope.currentListing.category.text = "Consumer Electronics > Portable Audio & Headphones";
        } else if(option == $scope.iPhoneID){
            $scope.currentListing.category.primary = $scope.iPhoneID; //Cell Phones & Accessories > Cell Phones & Smartphones
            document.getElementById('productType1').classList.remove('btn-filled');
            document.getElementById('productType2').classList.add('btn-filled');
            $scope.currentListing.title.type = "Apple iPhone";
            $scope.currentListing.title.full = createListingTitle();
            $scope.currentListing.category.text = "Cell Phones & Accessories > Cell Phones & Smartphones";
        }
    }

    $scope.selectModel = function(option, clear){
        if(!clear) {
            if($scope.currentListing.category.model != option.key){
                $scope.selectGeneration(null, true);
            }
            $scope.currentListing.category.model = option.key;
            $scope.listingFilters.capacityList = option.capacityList;
            $scope.listingFilters.colorList = option.colorList;
            $scope.listingFilters.generationList = option.generationList;
            //Generation is n/a for iPhone, so set to true and skip
            if($scope.currentListing.category.primary == $scope.iPhoneID){
                $scope.currentListing.category.generation = true;
            }
            var models = $scope.currentListing.category.primary == $scope.iPodID ? $scope.ipod_models : $scope.iphone_models;
            for (let i = 0; i < models.length; i++) {
                if (models[i].key == option.key) {
                    document.getElementById('model' + models[i].key).classList.add('btn-filled');
                    $scope.currentListing.title.model = models[i].longValue != null ? models[i].longValue : models[i].value;
                    $scope.currentListing.title.full = createListingTitle();
                }
                else
                    document.getElementById('model' + models[i].key).classList.remove('btn-filled');
            }
        } else { //clear data below Model
            $scope.currentListing.title.model = null;
            $scope.currentListing.category.model = null;
            $scope.selectGeneration(null, true);
        }
    }

    $scope.selectGeneration = function(option, clear) {
        if(!clear) {
            if($scope.currentListing.category.generation != option.key){
                $scope.selectCapacity(null, true);
            }
            $scope.currentListing.category.generation = option.key;
            for (let i = 0; i < $scope.ipod_generations.length; i++) {
                if ($scope.ipod_generations[i].key == option.key) {
                    document.getElementById('generation' + $scope.ipod_generations[i].key).classList.add('btn-filled');
                    $scope.currentListing.title.generation = $scope.ipod_generations[i].longValue;
                    $scope.currentListing.title.full = createListingTitle();
                }
                else {
                    if (document.getElementById('generation' + $scope.ipod_generations[i].key))
                        document.getElementById('generation' + $scope.ipod_generations[i].key).classList.remove('btn-filled');
                }
            }
        } else { //clear data below Capacity
            $scope.currentListing.title.generation = null;
            $scope.currentListing.category.generation = null;
            if($scope.currentListing.category.model && $scope.currentListing.category.primary != $scope.iPhoneID) {
                for (let i = 0; i < $scope.ipod_generations.length; i++) {
                    if(document.getElementById('generation' + $scope.ipod_generations[i].key))
                        document.getElementById('generation' + $scope.ipod_generations[i].key).classList.remove('btn-filled');
                }
            }
            $scope.selectCapacity(null, true);
        }
    }

    $scope.selectCapacity = function(option, clear) {
        if(!clear) {
            if($scope.currentListing.category.capacity != option.key){
                $scope.selectColor(null, true);
            }
            $scope.currentListing.category.capacity = option.key;
            for (let i = 0; i < $scope.storage_sizes.length; i++) {
                if ($scope.storage_sizes[i].key == option.key) {
                    document.getElementById('size' + $scope.storage_sizes[i].key).classList.add('btn-filled');
                    if($scope.currentListing.category.primary == $scope.iPodID)
                        $scope.currentListing.title.capacity = $scope.storage_sizes[i].spacedValue;
                    if($scope.currentListing.category.primary == $scope.iPhoneID)
                        $scope.currentListing.title.capacity = $scope.storage_sizes[i].value;
                    $scope.currentListing.title.full = createListingTitle();
                }
                else {
                    if (document.getElementById('size' + $scope.storage_sizes[i].key))
                        document.getElementById('size' + $scope.storage_sizes[i].key).classList.remove('btn-filled');
                }
            }
        } else { //clear data below Capacity
            $scope.currentListing.title.capacity = null;
            $scope.currentListing.category.capacity = null;
            if($scope.currentListing.category.generation) {
                for (let i = 0; i < $scope.storage_sizes.length; i++) {
                    if(document.getElementById('size' + $scope.storage_sizes[i].key))
                        document.getElementById('size' + $scope.storage_sizes[i].key).classList.remove('btn-filled');
                }
            }
            $scope.selectColor(null, true);
        }
    }

    $scope.selectColor = function(option, clear) {
        if(!clear) {
            $scope.currentListing.category.color = option.key;
            for (let i = 0; i < $scope.product_colors.length; i++) {
                if ($scope.product_colors[i].key == option.key) {
                    document.getElementById('color' + $scope.product_colors[i].key).classList.add('btn-filled');
                    $scope.currentListing.title.color = $scope.product_colors[i].value;
                    $scope.currentListing.title.full = createListingTitle();
                }
                else {
                    if (document.getElementById('color' + $scope.product_colors[i].key))
                        document.getElementById('color' + $scope.product_colors[i].key).classList.remove('btn-filled');
                }
            }
        } else { //clear data below Capacity
            $scope.currentListing.title.color = null;
            $scope.currentListing.category.color = null;
            if($scope.currentListing.category.capacity) {
                for (let i = 0; i < $scope.product_colors.length; i++) {
                    if(document.getElementById('color' + $scope.product_colors[i].key))
                        document.getElementById('color' + $scope.product_colors[i].key).classList.remove('btn-filled');
                }
            }
            $scope.selectCarrier(null, true);
        }
    }

    $scope.selectCarrier = function(option, clear) {
        if(!clear) {
            $scope.currentListing.category.carrier = option.key;
            for (let i = 0; i < $scope.iphone_carriers.length; i++) {
                if ($scope.iphone_carriers[i].key == option.key) {
                    document.getElementById('carrier' + $scope.iphone_carriers[i].key).classList.add('btn-filled');
                    $scope.currentListing.title.carrier = $scope.iphone_carriers[i].value;
                    $scope.currentListing.title.full = createListingTitle();
                }
                else {
                    if (document.getElementById('carrier' + $scope.iphone_carriers[i].key))
                        document.getElementById('carrier' + $scope.iphone_carriers[i].key).classList.remove('btn-filled');
                }
            }
        } else { //clear data below Capacity
            $scope.currentListing.title.carrier = null;
            $scope.currentListing.category.carrier = null;
            if($scope.currentListing.category.color) {
                for (let i = 0; i < $scope.iphone_carriers.length; i++) {
                    if(document.getElementById('carrier' + $scope.iphone_carriers[i].key))
                        document.getElementById('carrier' + $scope.iphone_carriers[i].key).classList.remove('btn-filled');
                }
            }
        }
    }

    $scope.selectCondition = function(option){
        $scope.currentListing.condition = option.key;
        for(let i = 0; i < $scope.listingConditions.length; i++){
            if($scope.listingConditions[i].key == option.key)
                document.getElementById('condition'+$scope.listingConditions[i].key).classList.add('btn-filled');
            else
                document.getElementById('condition'+$scope.listingConditions[i].key).classList.remove('btn-filled');
        }
    }

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
            //update properties file
            let shippingDetailsTemp = {
                shippingLocationCountry:$scope.currentListing.shippingLocationCountry,
                shippingLocationZIP:$scope.currentListing.shippingLocationZIP,
                shippingLocationCityState:$scope.currentListing.shippingLocationCityState
            };
            let shippingDetailsString = JSON.stringify(shippingDetailsTemp);
            $http({
                method: 'POST',
                url: "http://localhost:8080/updateUserShippingDetails",
                headers: {'Content-Type': undefined},
                data: {
                    shippingDetails: shippingDetailsString
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
                    console.log("successfully changed user shipping item location!");
                })
                .error(function (data, status) {
                    console.log("ERROR: failure updating user shipping details");
                });
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
            addItemRequest.getElementsByTagName("Title")[0].childNodes[0].nodeValue = $scope.currentListing.title.full;
        if($scope.currentListing.category.primary) {
            addItemRequest.getElementsByTagName("CategoryID")[0].childNodes[0].nodeValue = $scope.currentListing.category.primary;
        }
        if($scope.currentListing.condition)
            addItemRequest.getElementsByTagName("ConditionID")[0].childNodes[0].nodeValue = $scope.currentListing.condition;
        if($scope.currentListing.desc)
            addItemRequest.getElementsByTagName("Description")[0].childNodes[0].nodeValue = $scope.currentListing.desc;
        if($scope.currentListing.photoList) {
            var PictureDetailsElement = addItemRequest.getElementsByTagName("PictureDetails")[0];
            $scope.currentListing.photoList.forEach(function (photoURL) {
                //replace empty space in url with %20
                let tempURL = photoURL.replaceAll(" ", "%20");
                //create xml element
                let tempElement = addItemRequest.createElement("PictureURL");
                let tempTextNode = addItemRequest.createTextNode($location.absUrl() + tempURL);
                tempElement.appendChild(tempTextNode);
                PictureDetailsElement.appendChild(tempElement);
            });
        }
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
        if($scope.currentListing.catalogInfo.productId){
            let ItemElement = addItemRequest.getElementsByTagName("Item")[0];
            let tempElement = addItemRequest.createElement("ProductListingDetails");
            let tempChildElement = addItemRequest.createElement("ProductReferenceID");
            let tempTextNode = addItemRequest.createTextNode($scope.currentListing.catalogInfo.productId);
            tempChildElement.appendChild(tempTextNode);
            tempElement.appendChild(tempChildElement);
            ItemElement.appendChild(tempElement);
        }
        if($scope.currentListing.returnOption)
            addItemRequest.getElementsByTagName("ReturnsAcceptedOption")[0].childNodes[0].nodeValue = $scope.currentListing.returnOption;
        if($scope.currentListing.shippingLocationCityState)
            addItemRequest.getElementsByTagName("Location")[0].childNodes[0].nodeValue = $scope.currentListing.shippingLocationCityState;
        if($scope.currentListing.shippingLocationZIP)
            addItemRequest.getElementsByTagName("PostalCode")[0].childNodes[0].nodeValue = $scope.currentListing.shippingLocationZIP;
        if($scope.currentListing.shippingLocationCountry) {
            addItemRequest.getElementsByTagName("Country")[0].childNodes[0].nodeValue = 'US';
        }

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
        xhttp.open("GET", $scope.addItemRequestURL, true);
        xhttp.send();
    }

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
        $http.post($scope.tradingAPIDLL_Sandbox, xmlRequest, AddItemConfig).then( function(response){
            console.log(response.data);
            var ebayResponse = XMLParser.parseFromString(response.data,"text/xml");
            console.log("========RESPONSE RESULT========");
            console.log("VerifyAddItem Request: \n"+ebayResponse.getElementsByTagName("Ack")[0].childNodes[0].nodeValue);
            console.log("===============================");
        }, function(err){
            console.log("error.");
            console.log("Status: "+err.status+" : "+err.statusText);
        });
    };

}]);
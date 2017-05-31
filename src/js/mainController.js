/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('myApp', []);
app.controller('mainCtrl', function($scope) {

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

    /******************************************************
     * Login functions
     ******************************************************/
    $scope.openLoginModal = function() {
        var modal = document.getElementById('loginModal');
        modal.style.display = "block";
    };

    $scope.closeLoginModal = function() {
        var modal = document.getElementById('loginModal');
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the login modal, close it
    window.onclick = function(event) {
        var modal = document.getElementById('loginModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});
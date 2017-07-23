/**
 * Created by mitchcout on 7/19/2017.
 */
angular.module('easyListing').controller('selectProductModalCtrl', function ($scope, $uibModalInstance, productsListXML) {

    $scope.productsListXML = productsListXML;
    var getAttributesFromXML = function() {
        $scope.productTitle = $scope.productsListXML.getElementsByTagName("Title")[0].childNodes[0].nodeValue;
        if($scope.productsListXML.getElementsByTagName("DisplayStockPhotos")[0].childNodes[0].nodeValue == "true") {
            $scope.productStockPhotoURL = $scope.productsListXML.getElementsByTagName("StockPhotoURL")[0].childNodes[0].nodeValue;
            //if possible, replace with a higher resolution stock photo
            if ($scope.productStockPhotoURL.includes("6.JPG")) {
                $scope.productStockPhotoURL = $scope.productStockPhotoURL.replace("6.JPG", "3.JPG");
            }
        }
        $scope.productId = $scope.productsListXML.getElementsByTagName("ProductID")[0].childNodes[0].nodeValue;
    }
    getAttributesFromXML();

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.accept = function () {
        var productDetails = {
            productId:      $scope.productId,
            productTitle:   $scope.productTitle
        }
        $uibModalInstance.close(productDetails);
    };


});
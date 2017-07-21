/**
 * Created by mitchcout on 7/19/2017.
 */
angular.module('easyListing').controller('selectProductMultipleModalCtrl', function ($scope, $uibModalInstance, productsListXML) {

    $scope.productsListXML = productsListXML;
    $scope.productsList = [];

    $scope.stockPhotoURLIndex = 0;

    var getAttributesFromXML = function(index) {
        var productTemp = {};
        productTemp.productTitle = $scope.productsListXML.getElementsByTagName("Title")[index].childNodes[0].nodeValue;
        if($scope.productsListXML.getElementsByTagName("DisplayStockPhotos")[$scope.stockPhotoURLIndex].childNodes[0].nodeValue == "true") {
            productTemp.productStockPhotoURL = $scope.productsListXML.getElementsByTagName("StockPhotoURL")[index].childNodes[0].nodeValue;
            //if possible, replace with a higher resolution stock photo
            if (productTemp.productStockPhotoURL.includes("6.JPG")) {
                productTemp.productStockPhotoURL = productTemp.productStockPhotoURL.replace("6.JPG", "3.JPG");
            }
            $scope.stockPhotoURLIndex++; //increment the stock Photo URL ONLY if it existed in this product
        }
        productTemp.productId = $scope.productsListXML.getElementsByTagName("ProductID")[index].childNodes[0].nodeValue;
        return productTemp;
    }

    var getListFromXML = function() {
        var i = 0;
        while($scope.productsListXML.getElementsByTagName("Product")[i] != null){
            $scope.productsList.push(getAttributesFromXML(i));
            i++;
        }
    }
    getListFromXML();

    $scope.selectProduct = function(product){
        if($scope.productId != null){
            document.getElementById('product' + $scope.productId).classList.remove('card-inverse');
            document.getElementById('product' + $scope.productId).classList.remove('card-primary');
        }
        $scope.productId = product.productId;
        $scope.productTitle = product.productTitle;
        document.getElementById('product' + $scope.productId).classList.add('card-inverse');
        document.getElementById('product' + $scope.productId).classList.add('card-primary');
    }

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
